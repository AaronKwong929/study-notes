# 关于服务端渲染(Server Side Render)

> 将组件/页面通过服务器生成 html 字符串，发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。

> 相比于 SPA，SSR 更利好 SEO，减少页面首屏加载时间

> 和服务器直接输出静态文件相比，通过 Node 渲染页面再传递给客户端开销会更大

## 利弊

- 利

  - 利于搜索引擎优化

  - 白屏时间更短

- 弊

  - 代码复杂度增加：要兼容服务端和客户端运行

  - 需要更多服务器负载均衡

  - 需要 Node.JS 运行环境

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210828115813.png)

这是 Vue 官方的 ssr 基本流程，通过 webpack 打出给服务端用的 bundle 和客户端的 bundle

## 关于一些 SSR 框架

比较常见的 React - Next.js / Vue - Nuxt.js

Nuxt.js 初始化获取内容时不在 mounted 里，在 asyncData 里

其余踩坑需要生产环境支撑，有实践后再来补充

之后可以模仿实现一个小型的服务端渲染框架
