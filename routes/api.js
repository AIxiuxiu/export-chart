const express = require('express');
const router = express.Router();
const chart = require('../service/puppeteer-chart');

/* api listing. */
router.post("/img", async function (req, res) {
  req.body.api = 'img';
  req.body.urlPrefix = req.protocol + '://' + req.get('host');
  await chart.getChartsImg(res, req.body)
});

router.post("/html", async function (req, res) {
  req.body.api = 'html';
  req.body.urlPrefix = req.protocol + '://' + req.get('host');
  await chart.getChartsHtml(res, req.body)
});

router.post("/svg", async function (req, res) {
  req.body.api = 'svg';
  req.body.urlPrefix = req.protocol + '://' + req.get('host');
  await chart.getChartsSvg(res, req.body)
});

router.post("/url", async function (req, res) {
  req.body.api = 'url';
  req.body.urlPrefix = req.protocol + '://' + req.get('host');
  await chart.getChartsImgUrl(res, req.body)
});

router.post("/gif", async function (req, res) {
  req.body.api = 'gif';
  req.body.urlPrefix = req.protocol + '://' + req.get('host');
  await chart.getChartsGif(res, req.body)
});




module.exports = router;
