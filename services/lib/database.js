const debug = require('debug')('services:server');
const CloudantV1 = require('@ibm-cloud/cloudant').CloudantV1;
const {IamAuthenticator} = require('ibm-cloud-sdk-core');

let cloudant = null;

// Set by ibmcloud ce app bind
if (process.env.CE_SERVICES) {
  const ceServices = JSON.parse(process.env.CE_SERVICES);
  if (!ceServices) throw new Error('Missing CE_SERVICES.');

  const cloudantCreds = ceServices['cloudantnosqldb'][0];
  if (!cloudantCreds) throw new Error('Missing cloudantnosqldb.');

  const authenticator = new IamAuthenticator({
    apikey: cloudantCreds.credentials.apikey,
  });
  cloudant = new CloudantV1({
    authenticator: authenticator,
  });
  cloudant.setServiceUrl(cloudantCreds.credentials.url);
} else {
  // connect to local instance with CLOUDANT_* vars defined in .env.local
  cloudant = CloudantV1.newInstance();
}

const dbPrefix = process.env.NODE_DB_PREFIX || 'local_';

cloudant
  .getAllDbs()
  .then((response) => {
    debug(`cloudant dbs. (using dbs with prefix ${dbPrefix})`, response.result);
  })
  .catch((err) => {
    console.error(err);
    throw new Error('cloudant db is not available');
  });

module.exports = {
  service: cloudant,
  dbNames: {
    sbw2csv: dbPrefix + 'sbw2csv',
  },
};
