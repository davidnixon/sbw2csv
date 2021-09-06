var app = null;
var forward = null;

function main(request) {
  for (const [key, value] of Object.entries(request)) {
    if (!key.startsWith("__ow")) {
      if (typeof value != "string") process.env[key] = JSON.stringify(value);
      else process.env[key] = value;
    }
  }

  if (!app) {
    app = require("./app");
    forward = require("expressjs-openwhisk")(app);
  }

  // return { body: { ok: request } };
  return forward(request);
}

exports.main = main;
