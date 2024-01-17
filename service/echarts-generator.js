
/* 
Echars 导出图片
puppeteer https://zhaoqize.github.io/puppeteer-api-zh_CN
*/
const GIFEncoder = require('gifencoder');
const PNG = require('png-js');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const { isProd, imgFilePath, prodImgUrl } = require('./config');

const getScriptUrl = (jsName, urlPrefix) => {
    return `${urlPrefix}/lib/${jsName}`;
}

const geoMap = {
    'world': 'world',
    'china': 'china',
    'china-contour': 'china-contour',
    '安徽': 'province/anhui',
    '澳门': 'province/aomen',
    '北京': 'province/beijing',
    '重庆': 'province/chongqing',
    '福建': 'province/fujian',
    '甘肃': 'province/gansu',
    '广东': 'province/guangdong',
    '广西': 'province/guangxi',
    '贵州': 'province/guizhou',
    '海南': 'province/hainan',
    '河北': 'province/hebei',
    '黑龙江': 'province/heilongjiang',
    '河南': 'province/henan',
    '湖北': 'province/hubei',
    '湖南': 'province/hunan',
    '江苏': 'province/jiangsu',
    '江西': 'province/jiangxi',
    '吉林': 'province/jilin',
    '辽宁': 'province/liaoning',
    '内蒙古': 'province/neimenggu',
    '宁夏': 'province/ningxia',
    '青海': 'province/qinghai',
    '山东': 'province/shandong',
    '山西': 'province/shanxi',
    '陕西': 'province/shanxi1',
    '四川': 'province/sichuan',
    '台湾': 'province/taiwan',
    '天津': 'province/tianjin',
    '香港': 'province/xianggang',
    '新疆': 'province/xinjiang',
    '西藏': 'province/xizang',
    '云南': 'province/yunnan',
    '浙江': 'province/zhejiang'
};

const echarts = {

    addScript: async (page, data, jsName, rejected) => {
        if (data.api == 'html') {
            await page.addScriptTag({ url: getScriptUrl(jsName, data.urlPrefix) }).catch((err) => {
                rejected('addScriptTag错误：' + err);
            });
        } else {
            // 相对路径 process.cwd()
            await page.addScriptTag({ path: getScriptUrl(jsName, path.join('public')) }).catch((err) => {
                rejected('addScriptTag错误：' + err);
            });
        }
    },
    initEcharts: (page, data) => {
        page.logs = [];
        const addGeoJs = [];
        return new Promise(async (reslove, rejected) => {
            page.on('console', msg => {
                for (let i = 0; i < msg.args().length; ++i) {
                    logger.info(`${i}: ${msg.args()[i]}`); // 这句话的效果是打印到你的代码的控制台
                    page.logs.push(`${i}: ${msg.args()[i]}`);
                }
            });
            page.on('error', err => {
                rejected('Chrome浏览器页面崩溃：' + err);
            });
            page.on('pageerror', err => {
                rejected('页面错误：' + err);
            })

            await page.setContent(
                `<div id="container"></div>`
            );

            await echarts.addScript(page, data, 'jquery.min.js', rejected);
            await echarts.addScript(page, data, `echarts-${data.echartsVersion}.min.js`, rejected);
            if (data.theme) {
                await echarts.addScript(page, data, `theme/${data.theme}.js`, rejected);
                data.theme = `'${data.theme}'`;
            }
            const mapRegex = /map:\s*["']([\w-]*|[\u4e00-\u9fa5]*)["']/g;
            while ((result = mapRegex.exec(data.options)) != null) {
                const geoJs = geoMap[result[1]];
                if (geoJs && addGeoJs.indexOf(geoJs) == -1) {
                    await echarts.addScript(page, data, `map/${geoJs}.js`, rejected);
                    addGeoJs.push('geoJs');
                }
            }

            const wordcloudRegex = /type:\s*["'](wordcloud)["']/ig;
            if (wordcloudRegex.test(data.options)) {
                await echarts.addScript(page, data, `echarts-wordcloud-${data.wordcloudVersion}.min.js`, rejected);
            }

            const liquidfillRegex = /type:\s*["'](liquidfill)["']/ig;
            if (liquidfillRegex.test(data.options)) {
                await echarts.addScript(page, data, `echarts-liquidfill-${data.liquidfillVersion}.min.js`, rejected);
            }

            const glRegex = /type:\s*["'](scatter3D|bar3D|line3D|lines3D|map3D|surface|polygons3D|scatterGL|graphGL|flowGL)["']/g;
            if (glRegex.test(data.options)) {
                await echarts.addScript(page, data, `echarts-gl-${data.glVersion}.min.js`, rejected);
            }

            const echartsOpts = JSON.stringify(data.echartsOpts);

            const scriptToInject = `
                    myChart = echarts.init(document.getElementById('container'), ${data.theme}, ${echartsOpts});
                    myChart.on('finished', function() {
                        console.log('echarts finished')
                        document.getElementById('container').setAttribute('class', 'finished');
                    });
                    ${data.options}; 
                    if (option) {
                        option.animation = ${data.animation};
                        myChart.setOption(option);
                    }`;

            await page.evaluate(scriptText => {
                const el = document.createElement('script');
                el.type = 'text/javascript';
                el.textContent = scriptText;
                document.body.parentElement.appendChild(el);
            }, scriptToInject).catch((err) => {
                rejected('Script错误：' + err);
            });

            // await page.addScriptTag({
            //     content: scriptToInject
            // }).catch((err) => {
            //     rejected('Script错误：' + err);
            // });
            reslove();
        });
    },

    getEchartsBase64: async (page, data) => {
        let base64 = await page.evaluate((data) => {
            var canvas = myChart.getRenderedCanvas(data.dataURLOpts);
            var ctx = canvas.getContext("2d");
            if (data.marker) {
                ctx.globalAlpha = data.marker.alpha;
                ctx.textBaseline = data.marker.textBaseline;
                ctx.font = data.marker.font;
                ctx.fillStyle = data.marker.fontColor;
                ctx.rotate(data.marker.rotate * Math.PI / 180);
                ctx.fillText(data.marker.text, data.marker.x, data.marker.y);
            }
            return canvas.toDataURL('image/' + (data.dataURLOpts.type || 'png'));
            // return myChart.getDataURL(opts)
        }, data).catch(err => {
            page.logs.push(err.message);
            throw new Error(page.logs.join('\n'));
        });
        return base64
    },

    saveImgWithBase64: async (base64, data) => {
        var base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer.from(base64Data, 'base64'); // 解码图片
        var imgPath = path.join(imgFilePath, `${data.fileName}.${data.imgType}`);
        var dir = path.dirname(imgPath);
        fs.existsSync(dir) || fs.mkdirSync(dir);
        fs.writeFileSync(imgPath, dataBuffer, function (err) {
            if (err) {
                page.logs.push(err);
            }
            throw new Error(page.logs.join('\n'));
        });
    },

    waitFinish: async (page, data) => {
        if (data.delay) {
            await page.waitForSelector(`.finished ${data.echartsOpts.renderer}`, { timeout: data.delay }).catch(err => { });
        } else {
            await page.waitForSelector(`.finished ${data.echartsOpts.renderer}`, { timeout: 10000 }).catch(err => {
                page.logs.push(err.message);
                throw new Error(page.logs.join('\n'));
            });
        }
    },

    getEchartsImg: async ({ page, data }) => {
        await echarts.initEcharts(page, data).catch((err) => {
            throw new Error(err);
        });

        await echarts.waitFinish(page, data);

        let base64 = await echarts.getEchartsBase64(page, data).catch(err => {
            page.logs.push(err.message);
            throw new Error(page.logs.join('\n'));
        });

        return base64;
    },

    getEchartsImgURL: async ({ page, data }) => {
        await echarts.initEcharts(page, data).catch((err) => {
            throw new Error(err);
        });
        await echarts.waitFinish(page, data);

        let base64 = await echarts.getEchartsBase64(page, data).catch(err => {
            page.logs.push(err.message);
            throw new Error(page.logs.join('\n'));
        });
        echarts.saveImgWithBase64(base64, data);
        if (isProd) {
            return `${prodImgUrl}/${data.fileName}.${data.imgType}`
        } else {
            return `${data.urlPrefix}/${data.fileName}.${data.imgType}`;
        }

    },


    getEchartsHtml: async ({ page, data }) => {
        await echarts.initEcharts(page, data).catch((err) => {
            throw new Error(err);
        });
        const content = await page.content().catch((err) => {
            throw new Error(err);
        });
        return content;
    },

    getEchartsSvg: async ({ page, data }) => {
        data.echartsOpts.renderer = 'svg';
        await echarts.initEcharts(page, data).catch((err) => {
            throw new Error(err);
        });

        await echarts.waitFinish(page, data);

        let svg = await page.evaluate(() => {
            return document.querySelector(`.finished svg`).outerHTML;
        }).catch(err => {
            page.logs.push(err.message);
            throw new Error(page.logs.join('\n'));
        });
        return svg;
    },

    recordGif: async (page, data) => {
        var encoder = new GIFEncoder(data.width * data.pixelRatio, data.height * data.pixelRatio);
        encoder.createWriteStream()
            .pipe(fs.createWriteStream(data.outputName + '.gif'));

        encoder.start();
        encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(data.frameInterval);  // frame delay in ms
        encoder.setQuality(40); // image quality. 10 is default.

        for (i = 0; i < data.frameCounts; i++) {
            let base64 = await echarts.getEchartsBase64(page, data).catch(err => {
                page.logs.push(err.message);
                throw new Error(page.logs.join('\n'));
            });

            var base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer.from(base64Data, 'base64'); // 解码图片

            if (i > data.skipFrames) {
                var png = new PNG(dataBuffer);
                png.decode(function (pixels) {
                    encoder.addFrame(pixels);
                });
            }
        }
        encoder.finish();
    },

    recordGif2: async (page, data) => {
        await page.addScriptTag({ url: getScriptUrl('gif.js', data.urlPrefix) }).catch((err) => {
            rejected('addScriptTag错误：' + err);
        });

        function toBuffer(ab, byteLength) {
            var buf = new Uint8Array(byteLength);
            for (var i = 0; i < buf.length; ++i) {
                buf[i] = ab[i];
            }
            return buf;
        }

        await page.exposeFunction('savefile', async (data, byteLength) => {
            var buf = toBuffer(data, byteLength)
            fs.writeFile(path.join(imgFilePath, 'test.gif'), buf, function (err) {
                if (err) {
                    throw err;
                }
            });
        });

        var canvasOpts = JSON.stringify(data.dataURLOpts);
        data.gifOpts.workerScript = `${data.urlPrefix}/lib/gif.worker.js`;
        data.gifOpts = JSON.stringify(data.gifOpts);
        await page.addScriptTag({
            content: `
            var gif = new GIF(${data.gifOpts});
            gif.on('finished', function (blob) {
                console.error('gif finished');
                // var reader = new FileReader();
                // reader.readAsArrayBuffer(blob);
                // reader.onload = function (e) {
                //     console.error(e.target.result);
                //     const fdata = new Uint8Array(reader.result);
                //     //page.exposeFunction定义的函数
                //     window.savefile(fdata, fdata.length);
                // }
                var reader1 = new FileReader();
                reader1.readAsDataURL(blob);
                reader1.onload = function (e) {
                    window.getBase64(e.target.result);
                }
            });

            function exportToGif(time){
                console.error('exportToGif' + time);
                var start = Date.now()
                //time 为录制时长 毫秒
                time = time || 0

                function gifLoop() {
                    //这里使用requestAnimationFrame，一帧一帧的录制 添加太多，生成较慢
                    setTimeout(function(){
                        console.error('addFrame' + Date.now());
                        // 核心方法，向gif中加一帧图像，参数可以是img/canvas元素，还可以从ctx中复制一帧
                        var canvas = myChart.getRenderedCanvas(${canvasOpts});
                        var ctx = canvas.getContext('2d');
                        gif.addFrame(ctx, {delay: ${data.gifDelay}});
                        if (Date.now() - start >= time) {
                            gif.render();//开始启动 导出gif
                        } else {
                            gifLoop()
                        }
                    }, ${data.gifInterval})//间隔越短，导出时间越长
                }
                gifLoop()
            }
            exportToGif(${data.gifTime});
            `
        }).catch(err => {
            page.logs.push(err.message);
            throw new Error(page.logs.join('\n'));
        });

    },
    getEchartsGif: async ({ page, data }) => {
        await echarts.initEcharts(page, data).catch((err) => {
            throw new Error(err);
        });

        await echarts.waitFinish(page, data);

        // await echarts.recordGif(page, data).catch((err) => {
        //     throw new Error(err);
        // });

        // return `${data.urlPrefix}/test.gif`;

        await echarts.recordGif2(page, data).catch((err) => {
            throw new Error(err);
        });

        var base64;
        await page.exposeFunction('getBase64', async (data) => {
            base64 = data;
            page.evaluate(() => {
                document.getElementById('container').setAttribute('class', 'gif');
            });
        });

        await page.waitForSelector(`.gif`, { timeout: 60000 }).catch(err => {
            page.logs.push(err);
            throw new Error(page.logs.join('\n'));
        });

        return base64;
    },
}

exports.echarts = echarts;