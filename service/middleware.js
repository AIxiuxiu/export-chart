/*
 * @Description: express中间组件
 * @Author: ahl
 * @Date: 2021-01-22 10:18:17
 * @LastEditTime: 2021-01-22 13:32:38
 */
const path = require('path');
const JsonResult = require('./JsonResult');
const logger = require('./logger');

/**
 * 404错误
 */
function handle404(req, res, next) {
    if (req.method === 'GET' || req.method === 'DELETE') {
        logger.error('handle 404 with url', req.url, req.query);
    } else {
        logger.error('handle 404 with url', req.url, req.body);
    }
    if (req.accepts('html')) {
        res.status(404).sendFile(path.join(__dirname, '..', 'views', '404.html'));
        return;
    }
    if (req.accepts('json')) {
        res.send(JsonResult.failWithCode(404, 'Not found'));
        return;
    }
    res.type('txt').send('Not found');
}

/**
 * 服务端500错误
 */
function catchError(err, req, res, next) {
    let message = 'Unknown Error';
    let statusCode = 500;
    let stack = '';
    if (err instanceof Error) {
        message = err.message;
        stack = err.stack;
    } else if (typeof err === 'string') {
        message = err;
    }
    if (req.method === 'GET' || req.method === 'DELETE') {
        logger.error(`handle 500 with url:${req.url}, error:${message}, stack:${stack}`);
    } else {
        logger.error(`handle 500 with url:${req.url}, error:${message}, stack:${stack}`);
    }

    if (!res.headersSent) { // 若请求还未结束，则回复错误
        res.status(statusCode).format({
            html() {
                res.status(statusCode).end(
                    `<h2>${statusCode} ${message}</h2><pre>${stack}</pre>`);
            },
        });
    }
};

module.exports = { handle404, catchError };