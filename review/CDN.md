# Content Delivery Network 内容分发网络

CDN 基本原理是采用各种缓存服务器，将这些缓存服务器分布到用户访问相对集中的地区或网络中，在用户访问网站时，利用全局负载技术将用户访问指向距离最近的工作正常的缓存服务器上，由缓存服务器直接响应用户请求。

## CDN 工作流程

1. 用户请求网址，浏览器第一次发现本地没有 DNS 缓存，浏览器向.com 请求域名解析

2. CDN 对域名进行调整，域名解析结果是 CDN 指向的域名(cname 到 cdn 域名)

3. CDN 的 DNS 负载均衡系统找到响应最快的 IP 地址，返回给用户

4. 用户请求该 IP

5. 缓存服务器响应并返回内容

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210812092155.png)

## 相关问题

缓存策略是由源主机决定的，一般来说源主机没配 Cache-Control: max-age 的话 CDN 服务商会给加个 600

如果 CDN 有缓存直接返回，如果没有的话，CDN 向主机请求，并且缓存后再返回

公共资源(Vue, ElementUI, lodash)等，在 Webpack 配置 external，就可以避免打包进项目重刷
