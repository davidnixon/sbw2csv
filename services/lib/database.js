var dbPrefix = process.env.NODE_DB_PREFIX || "local_";
var instName = process.env.NODE_DB_INST || "Cloudant-unlikely-kneel-chief";

var cloudDB;

/**
 * The VCAP_SERVICES environment variable is defined in production. So use it to connect to cloudant DB
 */
/* istanbul ignore if */
if (process.env.VCAP_SERVICES) {
  // Load the Cloudant library.
  var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
  var Cloudant = require("@cloudant/cloudant");
  var cloudant = Cloudant({
    vcapInstanceName: instName,
    vcapServices: vcap_services,
  });

  cloudant.db.list(function (err, body) {
    if (err) {
      console.error(err);
      throw "cloudant db is not available";
    } else {
      console.log(`cloudant dbs. (using dbs with prefix ${dbPrefix})`, body);
    }
  });

  cloudDB = cloudant;
} else {
  /**
   * The VCAP_SERVICES environment variable is NOT defined so we expect we are running locally in development mode. Use the NODE_DB_URL to connect to couch db
   */

  const logger = (data) => {
    const url = require("url");
    // only output logging if there is an environment variable set
    /* istanbul ignore if */
    if (process.env.NODE_LOG_NANO === "true") {
      if (typeof data.err === "undefined") {
        // if this is a request
        const u = new url.URL(data.uri);
        console.warn("DB REQUEST", data.method, u.pathname, data.qs);
        if (process.env.NODE_LOG_NANO_TRACE === "trace") console.trace();
      } else {
        // this is a response
        const prefix = data.err ? "ERR" : "OK";
        //console.log(prefix, data.headers.statusCode, JSON.stringify(data.body).length)
      }
    }
  };

  const nano = require("nano")({ url: process.env.NODE_DB_URL, log: logger });
  console.log("Started nano...");

  nano.db.list(function (err, body) {
    /* istanbul ignore if */
    if (err) {
      console.error(err);
      console.log(
        "\x1b[31m%s\x1b[0m",
        "try running: 'yarn serve' from the database directory"
      );
      throw "local db is not available. Check contents of .env.local file";
    } else {
      console.log(`cloudant dbs. (using dbs with prefix ${dbPrefix})`, body);
    }
  });

  cloudDB = nano;
}

module.exports = {
  db: cloudDB,
  dbNames: {
    sbw2csv: dbPrefix + "sbw2csv",
  },
};
