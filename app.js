const express = require('express');
const path = require('path');
const logger = require('./service/logger');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const { handle404, catchError } = require('./service/middleware');

const app = express();

logger.info('start with NODE_ENV：' + process.env.NODE_ENV);
// 日志
app.use(logger.connectLogger(logger.httpLogger));
// 使用 GZIP 中间件合并请求
app.use(compression());
// http安全性
app.use(helmet({ contentSecurityPolicy: false }));
// 启用 CROS https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS
app.use(cors({
  // 允许跨域的域名
  origin: ['http://sc.p5w.net', 'http://xa.p5w.net'],
  methods: ['GET', 'POST'],
}));

// 请求主体解析 JSON 和 编码
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 静态文件
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'echarts')));
app.use('/monaco-editor', express.static(__dirname + '/node_modules/monaco-editor/'));
app.use('/js-beautify', express.static(__dirname + '/node_modules/js-beautify/'));

app.use('/layui', express.static(__dirname + '/node_modules/layui-src/dist/'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 添加路由
app.use('/', indexRouter);
app.use('/api', apiRouter);

// 404错误
app.use(handle404);
// 500错误
app.use(catchError);

module.exports = app;
