# export-chart

由于项目要用到服务器生成图片的功能
使用了 puppeteer 作为 headless 浏览器来渲染图片，返回生成图片的 base64 码。

## 安装

使用 yarn 安装依赖

```
yarn
```

## 启动

```
npm start
```

无需重启刷新可使用 nodemon

```
npm run dev
```

## 部署：

安装 pm2

```
npm install pm2 -g
//或
yarn global add pm2
```

集群模式下日志问题，需安装 pm2-intercom

```
pm2 install pm2-intercom
```

启动
pm2 start ecosystem.config.js

查看日志

```
pm2 logs
```

查看当前通过 pm2 运行的进程的状态

```
pm2 monit
```

停止所有进程

```
pm2 stop all
```

重启

```
pm2 restart all
```

正式环境图片放到 /home/pic/echarts 下

线上地址 [http://192.168.23.92:3000](http://192.168.23.92:3000)

## 组件扩展

### 地图

已集成 china,word 和国内省份
自定义地图
http://datav.aliyun.com/tools/atlas/#&lat=30.332329214580163&lng=106.72278672066881&zoom=3.5

### ECharts GL

提供丰富的三维可视化组件, https://github.com/ecomfe/echarts-gl

### 水球图

水球图组件 https://github.com/ecomfe/echarts-liquidfill

### 字符云

字符云组件, https://github.com/ecomfe/echarts-wordcloud

### 版本兼容相关

echarts-5.0.0 在图片导出时 pixelRatio 大于 1 报错，无法下载图片，echarts-5.0.2 已解决此 bug，推荐使用 echarts-5.0.0 已修改为 5.0.2

echarts-4 匹配 echarts-gl-1.1.2min.js、echarts-liquidfill-2.0.6.min.js、echarts-wordcloud-1.1.2.min.js

echarts5 匹配 echarts-gl-2.0.2-min.js、echarts-liquidfill-3.0.0.min.js、echarts-wordcloud-2.0.0.min.js

liquidFill（水波球）waveAnimation 配置项为 true 时无法导出图片，仅支持 html 生成，或使用 delay 参数
