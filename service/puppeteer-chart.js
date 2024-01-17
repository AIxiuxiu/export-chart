/*
 * @Description: 调用puppeteer生成图片
 * @Author: ahl
 * @Date: 2021-01-14 17:04:11
 * @LastEditTime: 2021-02-22 16:01:18
 */
const { Cluster } = require('puppeteer-cluster');
const { echarts } = require('./echarts-generator');
const JsonResult = require('./JsonResult');
const dayjs = require('dayjs');
const path = require('path');
const logger = require('./logger');

var cluster;

const fileReg = new RegExp('[\\\\/:*?\"<>|]');

const getCluster = async function () {
    if (!cluster) {
        cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            maxConcurrency: 10,
            timeout: 60000,
            puppeteerOptions: {
                // headless: false, //调试使用
                // slowMo: 250, // slow down by 250ms
                args: [
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-first-run',
                    '--no-sandbox',
                    '--no-zygote',
                    '--single-process',
                    '--disable-web-security'
                ],
                defaultViewport: {
                    width: 1920,
                    height: 1200,
                    // deviceScaleFactor: 2
                }
            }
        });
    }
    return cluster
}

/**
 * 获取参数
 * @param {参数} params 
 */
function getParams(params) {

    if (!params.options) {
        return "options不能为空"
    }

    if (!params.width) {
        params.width = 600;
    } else {
        if (parseFloat(params.width).toString() == 'NaN') {
            return "参数width和height不是数字！";
        }
        if (parseFloat(params.width) <= 0) {
            return "参数width和height必须大于0！";
        }
    }

    if (!params.height) {
        params.height = 400;
    } else {
        if (parseFloat(params.height).toString() == 'NaN') {
            return "参数width和height不是数字！";
        }
        if (parseFloat(params.height) <= 0) {
            return "参数width和height必须大于0！";
        }
    }

    if (!params.imgType) {
        params.imgType = 'png';
    } else if (params.imgType != 'png' && params.imgType != 'jpeg') {
        return "参数imgType必须是png或jpeg";
    }


    if (!params.echartsVersion) {
        params.echartsVersion = '4.8.0';
    }

    if (params.echartsVersion == '5.0.0') {
        params.wordcloudVersion = '2.0.0';
        params.liquidfillVersion = '3.0.0';
        params.glVersion = '2.0.2';
    } else {
        params.wordcloudVersion = '1.1.2';
        params.liquidfillVersion = '2.0.6';
        params.glVersion = '1.1.2';
    }

    if (!params.pixelRatio) {
        params.pixelRatio = 1;
    } else if (parseInt(params.pixelRatio, 10).toString() == 'NaN') {
        return "参数pixelRatio不是数字！";
    } else if (params.pixelRatio < 0 || params.pixelRatio > 4) {
        return "参数pixelRatio必须是1到4或者不传";
    }

    if (!params.delay) {
        params.delay = 0;
    } else if (parseInt(params.delay, 10).toString() == 'NaN') {
        return "参数delay不是数字！";
    } else if (params.delay < 0 || params.delay > 10000) {
        return "参数delay必须是0到10000或者不传";
    }

    if (params.theme == '') {
        params.theme = null;
    }

    if (!params.echartsOpts) {
        params.echartsOpts = {
            'devicePixelRatio': params.devicePixelRatio,
            'renderer': params.renderer || 'canvas',
            'width': params.width,
            'height': params.height
        }
    }

    if (!params.dataURLOpts) {
        params.dataURLOpts = {
            'type': params.imgType,
            'pixelRatio': params.pixelRatio,
            'backgroundColor': params.backgroundColor,
            'excludeComponents': params.excludeComponents
        }
    }

    // 水印
    if (params.marker) {
        if (typeof params.marker == 'boolean' || params.marker == 'true') {
            params.marker = {
                text: '西安全景',
                font: 'normal 18px Microsoft Yahei',
                fontColor: '#96a3b0',
                textBaseline: 'bottom',
                alpha: 0.8,
                rotate: 0,
                x: params.width - 80,
                y: params.height - 20,
            }
        } else if (typeof params.marker == 'object') {
            params.marker = Object.assign({
                text: '西安全景',
                font: 'normal 18px Microsoft Yahei',
                fontColor: '#96a3b0',
                textBaseline: 'bottom',
                alpha: 0.8,
                rotate: 0,
                x: params.width - 80,
                y: params.height - 20,
            }, params.marker);
        } else {
            return "参数marker类型错误！";
        }
    }

    if (params.api == 'url') {
        if (!params.appName) {
            params.appName = dayjs().format('YYYYMMDD');
        } else {
            if (fileReg.test(params.appName)) {
                return "appName不能包含【\\\\/:*?\"<>|】这些非法字符!";
            }
            const timeReg = new RegExp('\\d{8}');
            if (timeReg.test(params.appName)) {
                return "appName不能使用时间格式YYYYMMDD";
            }
        }
        if (!params.fileName) {
            params.fileName = `${Date.now()}`;
        } else {
            if (fileReg.test(params.fileName)) {
                return "fileName不能包含【\\\\/:*?\"<>|】这些非法字符!";
            }
        }
        params.fileName = path.join(params.appName, params.fileName);
    }

    if (params.api == 'gif') {
        // if (!params.outputName) {
        //     params.outputName = 'gif/test';
        // }
        // if (!params.snapshotInterval) {
        //     params.snapshotInterval = 10;
        // }
        // if (!params.skipFrames) {
        //     params.skipFrames = 0;
        // }
        // if (!params.frameCounts) {
        //     params.frameCounts = 100;
        // }
        if (!params.gifTime) {
            params.gifTime = 0;
        }
        if (!params.gifInterval) {
            params.gifInterval = 50;
        }
        if (!params.gifDelay) {
            params.gifDelay = 54;
        }
        if (!params.gifOpts) {
            params.gifOpts = {
                repeat: params.gifRepeat || 0,
                workers: params.gifWorkers || 4,
                quality: params.gifQuality || 50,
                width: params.width * params.pixelRatio,
                height: params.height * params.pixelRatio,
            }
        }

    }

    params.animation = !!params.animation;
}

/**
 * 获取echarts图片
 * @param {返回} res 
 * @param {参数} params 
 */
const getChartsImg = async function (res, params) {
    try {
        const error = getParams(params);
        if (error) {
            res.send(JsonResult.validateFailed(error));
        } else {
            const cluster = await getCluster()
            const base = await cluster.execute(params, echarts.getEchartsImg);
            res.send(JsonResult.success(base));
        }
    } catch (err) {
        logger.error(err.message)
        res.send(JsonResult.fail(err.message));
    }
}

/**
 * 获取echarts URL
 * @param {返回} res 
 * @param {参数} params 
 */
const getChartsImgUrl = async function (res, params) {
    try {
        const error = getParams(params);
        if (error) {
            res.send(JsonResult.validateFailed(error));
        } else {
            const cluster = await getCluster()
            const url = await cluster.execute(params, echarts.getEchartsImgURL);
            res.send(JsonResult.success(url));
        }
    } catch (err) {
        logger.error(err.message);
        res.send(JsonResult.fail(err.message));
    }
}

/**
 * 获取echarts HTML
 * @param {返回} res 
 * @param {参数} params 
 */
const getChartsHtml = async function (res, params) {
    try {
        const error = getParams(params);
        if (error) {
            res.send(JsonResult.validateFailed(error));
        } else {
            const cluster = await getCluster()
            const html = await cluster.execute(params, echarts.getEchartsHtml);
            res.send(JsonResult.success(html));
        }
    } catch (err) {
        logger.error(err.message);
        res.send(JsonResult.fail(err.message));
    }
}

/**
 * 获取echarts SVG
 * @param {返回} res 
 * @param {参数} params 
 */
const getChartsSvg = async function (res, params) {
    try {
        const error = getParams(params);
        if (error) {
            res.send(JsonResult.validateFailed(error));
        } else {
            const cluster = await getCluster()
            const svg = await cluster.execute(params, echarts.getEchartsSvg);
            res.send(JsonResult.success(svg));
        }
    } catch (err) {
        logger.error(err.message);
        res.send(JsonResult.fail(err.message));
    }
}

/**
 * 获取echarts gif
 * @param {返回} res 
 * @param {参数} params 
 */
const getChartsGif = async function (res, params) {
    try {
        const error = getParams(params);
        params.animation = true;
        if (error) {
            res.send(JsonResult.validateFailed(error));
        } else {
            const cluster = await getCluster()
            const result = await cluster.execute(params, echarts.getEchartsGif);
            res.send(JsonResult.success(result));
        }
    } catch (err) {
        logger.error(err.message);
        res.send(JsonResult.fail(err.message));
    }
}

const chart = {
    getCluster,
    getChartsImg,
    getChartsHtml,
    getChartsSvg,
    getChartsImgUrl,
    getChartsGif
}

getCluster();

module.exports = chart;
