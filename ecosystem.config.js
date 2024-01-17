module.exports = {
  apps: [{
    name: 'export-chart',
    script: 'bin/www',
    watch: ['bin', 'routes', 'service', 'public', 'view', 'app.js', 'ecosystem.config.js'],
    ignore_watch: ['node_modules', 'logs', 'echarts'],//忽略监听的文件夹
    max_memory_restart: '500M',//内存达到多少会自动restart
    env: {
      NODE_ENV: 'production'
    },
    instance_var: "NODE_APP_INSTANCE",
    instances: "max",              // 应用启动实例个数，仅在 cluster 模式有效
    min_uptime: "60s",             // 应用运行少于时间被认为是异常启动
    max_restarts: 10,              // 最大异常重启次数
    autorestart: true,             // 默认为 true, 发生异常的情况下自动重启
    restart_delay: "60"            // 异常重启情况下，延时重启时间
  },
  {
    name: "export-chart-cron-job",
    script: "cronJob.js",
    watch: ['cronJob.js', 'ecosystem.config.js'],
    env: {
      NODE_ENV: 'production'
    },
    // 定时重启,仅在 cluster 模式有效, [minute] [hour] [day] [month] [day of week]
    cron_restart: "1 0 * * *",
    out_file: "logs/cronJob-out.log",
    error_file: "logs/cronJob-out.log",
    interval: 7,
    instances: 1
  }]
};
