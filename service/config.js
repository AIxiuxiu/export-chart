/*
 * @Description:
 * @Author: ahl
 * @Date: 2021-01-29 10:00:03
 * @LastEditTime: 2021-01-29 10:39:40
 */

const path = require('path');

/**
 * 是否是正式环境
 */
const isProd = process.env.NODE_ENV === 'production';

const imgFilePath = isProd ? '/home/pic/echarts' : path.join(__dirname, '..', 'echarts');

const prodImgUrl = 'http://wxpic.p5w.net/echarts';

module.exports = { isProd, imgFilePath, prodImgUrl }