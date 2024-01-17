/*
 * @Description: 日志的封装
 * @Author: ahl
 * @Date: 2021-01-14 13:34:07
 * @LastEditTime: 2021-01-29 10:00:16
 */

const log4js = require('log4js');

const options = {
    pm2: true,
    pm2InstanceVar: "NODE_APP_INSTANCE",
    appenders: {
        "ConsoleLogAppender": {
            "type": "console"
        },
        "SystemLogAppender": {
            "type": "file",
            "filename": "./logs/system.log",
            "maxLogSize": 102400,
            "backups": 2
        },
        "HttpLogAppender": {
            "type": "dateFile",
            "filename": "./logs/http",
            "pattern": "yyyy-MM-dd.log",
            "daysToKeep": 7,
            "alwaysIncludePattern": true,
        }
    },
    categories: {
        "default": {
            "appenders": [
                "ConsoleLogAppender"
            ],
            "level": "all"
        },
        "system": {
            "appenders": process.env.NODE_ENV === 'production' ?
                [
                    "ConsoleLogAppender",
                    "SystemLogAppender"
                ] :
                [
                    "ConsoleLogAppender"
                ],
            "level": "info"
        },
        "http": {
            "appenders": process.env.NODE_ENV === 'production' ?
                [
                    "ConsoleLogAppender",
                    "HttpLogAppender"
                ] :
                [
                    "ConsoleLogAppender"
                ],
            "level": "info"
        }
    },
    replaceConsole: true
}

log4js.configure(options);

// 系统日志
const systemLogger = log4js.getLogger('system');
// http请求日志
const httpLogger = log4js.getLogger('http');
// 默认日志
const defaultLogger = log4js.getLogger('default');

const logger = {
    log4js,
    systemLogger,
    httpLogger,
    defaultLogger,

    connectLogger() {
        return log4js.connectLogger.apply(log4js, arguments);
    },

    trace() {
        systemLogger.trace.apply(systemLogger, arguments);
    },
    debug() {
        systemLogger.debug.apply(systemLogger, arguments);
    },
    info() {
        systemLogger.info.apply(systemLogger, arguments);
    },
    warn() {
        systemLogger.warn.apply(systemLogger, arguments);
    },
    error() {
        systemLogger.error.apply(systemLogger, arguments);
    },
    fatal() {
        systemLogger.fatal.apply(systemLogger, arguments);
    },
    mark() {
        systemLogger.mark.apply(systemLogger, arguments);
    }

}

module.exports = logger;
