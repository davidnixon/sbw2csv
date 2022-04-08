const express = require('express');
const router = express.Router();
const debug = require('debug')('services:convert');
const info = require('debug')('services:server');
const {exec} = require('child_process');
const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const Shred = require('node-shred');
const cos = require('../lib/cos.js');

const upload = multer({dest: path.join(__dirname, 'uploads')});
const sbw2csvCli = path.join(__dirname, '..', 'cli', 'build', 'sbw2csv');
info('cli', sbw2csvCli);
const converted = path.join(__dirname, 'converted');
info('converted dir', converted);

router.get('/version', (req, res) => {
  exec(`"${sbw2csvCli}" --version`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ok: false, message: error});
    }
    debug(`stdout: ${stdout}`);
    debug(`stderr: ${stderr}`);
    return res.status(200).send({ok: true, message: stdout.trim()});
  });
});

router.post('/', upload.array('sbwFiles', 12), (req, res) => {
  if (req.files.length == 0) {
    return res.status(400).send({ok: false, message: 'no files uploaded'});
  }

  req.files.forEach((element) => {
    debug(`UPLOADED ${element.path}`);
  });
  const paths = `--input ${req.files.map((element) => element.path).join(' --input ')}`;
  fs.mkdirSync(converted, {recursive: true});
  const outputFile = path.format({
    dir: converted,
    name: uuidv4(),
    ext: '.csv',
  });
  debug(`"${sbw2csvCli}" ${paths} --output ${outputFile}`);

  exec(`"${sbw2csvCli}" ${paths} --output ${outputFile}`, (error, stdout, stderr) => {
    // shred the uploaded files
    const files = req.files.map((item) => item.path);
    const shred = Shred({remove: true, files: files});
    debug('shred', files);
    shred.on('error', (err) => {
      console.error(shred, err);
    });

    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ok: false, message: error});
    }
    // debug(`stdout: ${stdout}`);
    debug(`stderr: ${stderr}`);
    const relative = path.relative(path.dirname(converted), outputFile);
    cos.upload(relative, outputFile).then((result) => {
      info(result);
      return res.status(200).send({ok: true, message: relative});
    });
  });
});

module.exports = router;
