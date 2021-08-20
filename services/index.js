require("dotenv-flow").config();
const cloudDB = require("./lib/database.js");
const express = require("express");
const { exec } = require("child_process");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const converted = path.join(__dirname, "converted");
const upload = multer({ dest: path.join(__dirname, "uploads") });
const app = express();

const port = process.env.SERVICES_PORT || 3000;
const SBW2CSV = process.env.SBW2CSV || "./bin/sbw2csv";

app.use("/converted", express.static(path.join(__dirname, "converted")));
app.use(express.json());

app.post("/convert", upload.array("sbwFiles", 12), (req, res) => {
  req.files.forEach((element) => {
    console.log(element.path);
  });
  var paths = `--input ${req.files
    .map((element) => element.path)
    .join(" --input ")}`;
  fs.mkdirSync(converted, { recursive: true });
  var outputFile = path.format({
    dir: converted,
    name: uuidv4(),
    ext: ".csv",
  });

  exec(
    `"${SBW2CSV}" ${paths} --output ${outputFile}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send({ ok: false, message: error });
      }
      // console.log(`stdout: ${stdout}`);
      // console.error(`stderr: ${stderr}`);
      var relative = path.relative(path.dirname(converted), outputFile);
      return res.status(200).send({ ok: true, message: relative });
    }
  );
});

app.post("/analytics", function (req, res) {
  const doc = req.body;
  doc._id = `analytics:${uuidv4()}`;
  console.log(doc);
  var database = cloudDB.db.use(cloudDB.dbNames.sbw2csv);
  database
    .insert(doc)
    .then((response) => {
      return res.status(200).send({ ok: true });
    })
    .catch((err) => {
      return res.status(500).send({ ok: false, err: err });
    });
});

app.listen(port, () => {
  console.log(`services app listening at http://localhost:${port}`);
});
