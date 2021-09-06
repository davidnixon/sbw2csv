const debug = require("debug")("services:server");
const info = require("debug")("services:cos");
const COS = require("ibm-cos-sdk");
const fs = require("fs");
const async = require("async");
const fsPromises = require("fs").promises;

const bx_creds = JSON.parse(process.env.__bx_creds);
if (!bx_creds) throw new Error("Missing __bx_creds parameter.");

const cos_creds = bx_creds["cloud-object-storage"];
if (!cos_creds) throw new Error("Missing cloud-object-storage parameter.");

const endpoint = process.env.COS_ENDPOINT;
if (!endpoint) throw new Error("Missing COS_ENDPOINT parameter.");

const bucket = process.env.COS_BUCKET;
if (!bucket) throw new Error("Missing COS_BUCKET parameter.");

const config = {
  endpoint: endpoint,
  apiKeyId: cos_creds.apikey,
  serviceInstanceId: cos_creds.resource_instance_id,
};

const cos = new COS.S3(config);

cos
  .listBuckets()
  .promise()
  .then((data) => {
    if (data.Buckets != null) {
      for (var i = 0; i < data.Buckets.length; i++) {
        debug(
          `Bucket Name: ${data.Buckets[i].Name} using:${
            bucket === data.Buckets[i].Name
          }`
        );
      }
    }
  })
  .catch((e) => {
    console.error(`ERROR: ${e.code} - ${e.message}\n`);
  });

function uploadFile(itemName, filePath) {
  info(`Creating new item: ${itemName}`);
  return fsPromises
    .readFile(filePath, "utf8")
    .then((fileData) => {
      info(`sending ${fileData.length} characters`);
      return cos
        .putObject({
          ACL: "public-read",
          Bucket: bucket,
          Key: itemName,
          Body: fileData,
        })
        .promise();
    })
    .then(() => {
      info(`Item: ${itemName} created!`);
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

//TODO: This does not work correctly because it exits too soon. Convert it to use  fsPromises.readFile
// instead of fs.readFile. Also, only use if there are multiple parts. (Upload is bigger than 5MB)
function multiPartUpload(itemName, filePath) {
  var uploadID = null;

  if (!fs.existsSync(filePath)) {
    log.error(
      new Error(`The file \'${filePath}\' does not exist or is not accessible.`)
    );
    return;
  }

  info(`Starting multi-part upload for ${itemName} to bucket: ${bucket}`);
  return cos
    .createMultipartUpload({
      Bucket: bucket,
      Key: itemName,
      ACL: "public-read",
    })
    .promise()
    .then((data) => {
      uploadID = data.UploadId;

      //begin the file upload
      fs.readFile(filePath, (e, fileData) => {
        //min 5MB part
        var partSize = 1024 * 1024 * 5;
        var partCount = Math.ceil(fileData.length / partSize);

        async.timesSeries(
          partCount,
          (partNum, next) => {
            var start = partNum * partSize;
            var end = Math.min(start + partSize, fileData.length);

            partNum++;

            console.log(
              `Uploading to ${itemName} (part ${partNum} of ${partCount})`
            );

            cos
              .uploadPart({
                Body: fileData.slice(start, end),
                Bucket: bucket,
                Key: itemName,
                PartNumber: partNum,
                UploadId: uploadID,
              })
              .promise()
              .then((data) => {
                next(e, { ETag: data.ETag, PartNumber: partNum });
              })
              .catch((e) => {
                cancelMultiPartUpload(bucket, itemName, uploadID);
                console.error(`ERROR: ${e.code} - ${e.message}\n`);
              });
          },
          (e, dataPacks) => {
            cos
              .completeMultipartUpload({
                Bucket: bucket,
                Key: itemName,
                MultipartUpload: {
                  Parts: dataPacks,
                },
                UploadId: uploadID,
              })
              .promise()
              .then(
                console.log(
                  `Upload of all ${partCount} parts of ${itemName} successful.`
                )
              )
              .catch((e) => {
                cancelMultiPartUpload(bucket, itemName, uploadID);
                console.error(`ERROR: ${e.code} - ${e.message}\n`);
              });
          }
        );
      });
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

function cancelMultiPartUpload(bucket, itemName, uploadID) {
  return cos
    .abortMultipartUpload({
      Bucket: bucket,
      Key: itemName,
      UploadId: uploadID,
    })
    .promise()
    .then(() => {
      console.log(`Multi-part upload aborted for ${itemName}`);
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

module.exports = {
  service: cos,
  bucket: bucket,
  upload: uploadFile,
};
