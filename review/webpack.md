# Webpack 相关

`Entry` webpack 以那个文件为入口起点开始打包分析构建内部依赖图

`Output` webpack 打包后的资源 bundles 输出到哪里去，以及如何命名

`Loader` 让 webpack 能够处理非 javascript 文件

`Plugin` 执行范围更广的任务，打包优化、压缩等

`Mode` 区分开发环境和生产环境（默认开启的功能不同）

## loader

从右到左，从下到上

## plugin

插件机制依赖核心：`Tapable`，主要是控制钩子函数的发布与订阅

分同步和异步类钩子
