const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {title: 'Services layer for sbw2csv app'});
});

router.get('/health', (req, res) => {
  return res.status(200).send({ok: true});
});

module.exports = router;
