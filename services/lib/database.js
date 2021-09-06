const debug = require("debug")("services:server");
const CloudantV1 = require("@ibm-cloud/cloudant").CloudantV1;

if (process.env.__bx_creds) {
  const bx_creds = JSON.parse(process.env.__bx_creds);
  if (!bx_creds) throw new Error("Missing __bx_creds parameter.");
  const cloudant_creds = bx_creds["cloudantnosqldb"];
  if (cloudant_creds) {
    process.env.CLOUDANT_URL = cloudant_creds.url;
    process.env.CLOUDANT_APIKEY = cloudant_creds.apikey;
  }
}

const dbPrefix = process.env.NODE_DB_PREFIX || "local_";
const cloudant = CloudantV1.newInstance();

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
