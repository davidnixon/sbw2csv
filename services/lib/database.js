const debug = require("debug")("services:server");
const CloudantV1 = require("@ibm-cloud/cloudant").CloudantV1;
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

var cloudant = null;

// Set by ibmcloud ce app bind
if (process.env.CE_SERVICES) {
  const bx_creds = JSON.parse(process.env.CE_SERVICES);
  if (!bx_creds) throw new Error("Missing CE_SERVICES.");

  const cloudant_creds = bx_creds["cloudantnosqldb"][0];
  if (!cloudant_creds) throw new Error("Missing cloudantnosqldb.");

  const authenticator = new IamAuthenticator({
    apikey: cloudant_creds.credentials.apikey,
  });
  cloudant = new CloudantV1({
    authenticator: authenticator,
  });
  cloudant.setServiceUrl(cloudant_creds.credentials.url);
}
// connect to local instance with CLOUDANT_* vars defined in .env.local
else {
  cloudant = CloudantV1.newInstance();
}

const dbPrefix = process.env.NODE_DB_PREFIX || "local_";

cloudant
  .getAllDbs()
  .then((response) => {
    debug(`cloudant dbs. (using dbs with prefix ${dbPrefix})`, response.result);
  })
  .catch((err) => {
    console.error(err);
    throw "cloudant db is not available";
  });

module.exports = {
  service: cloudant,
  dbNames: {
    sbw2csv: dbPrefix + "sbw2csv",
  },
};
