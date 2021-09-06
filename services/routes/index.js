var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Services layer for sbw2csv app" });
});

router.get("/health", function (req, res) {
  return res.status(200).send({ ok: true });
});

module.exports = router;
