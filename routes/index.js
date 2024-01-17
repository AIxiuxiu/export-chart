const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/* GET index page. */
router.get('/', function (req, res, next) {
  const themes = [];
  fs.readdirSync(path.join(__dirname, '..', 'public', 'lib', 'theme')).forEach(file => {
    themes.push(file.replace('.js', ''));
  });
  res.render('index', { themes: themes });
});

router.get('/doc', function (req, res, next) {
  res.render('doc');
});

async function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

router.get('/error', (req, res, next) => {
  throw new Error('服务器出现错误')
})

router.get('/timeout', async (req, res, next) => {
  const time = Number(req.query.time || 60001)
  await sleep(time)
  res.json({ msg: '测试请求超时' })
})

module.exports = router;
