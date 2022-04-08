const express = require('express');
const router = express.Router();
const cloudDB = require('../lib/database.js');
const {v4: uuidv4} = require('uuid');
const debug = require('debug')('services:analytics');

router.post('/', (req, res) => {
  const doc = req.body;
  debug('received', doc);
  const cdoc = {
    _id: `analytics:${uuidv4()}`,
    ...doc,
  };

  cloudDB.service
    .postDocument({
      db: cloudDB.dbNames.sbw2csv,
      document: cdoc,
    })
    .then((response) => {
      response;
      return res.status(200).send({ok: true});
    })
    .catch((err) => {
      return res.status(500).send({ok: false, err: err});
    });
});

module.exports = router;
