# 关于 Worker

## 相关概念

`PWA` Progress Web Application 渐进式网页应用

采用渐进式改造，降低网站改造成本

提供更好的设备特性支持，优化动画效果，缩短和本地应用/小程序之间的距离

`Service Worker`在页面和网络之间增加一个拦截器，缓存/拦截请求

其存在于浏览器进程中，为多个页面服务

`Web Worker`运行在页面主线程外，不能访问到 DOM，通过 postMessage 和页面主线程交互，每次执行完都会退出

## 安全相关

只有 HTTPS 才可以启用 worker（即使拦截，无法破获内容，还可以校验内容完整性）

