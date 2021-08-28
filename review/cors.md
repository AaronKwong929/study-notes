# 关于同源策略

同`协议 域名 端口`可以相互访问资源和操作 DOM

表现在`DOM Web数据 网络` 三个层面

- DOM

  - 限制不同源 js 脚本对当前 DOM 的读和写

- 数据

  - 限制不同源站点读取当前站点 cookie，indexDB，LocalStorage 等数据

- 网络

  - 限制通过 XMLHttpRequest 将数据发给不同源的站点

## 与同源策略相关的 header 字段

`Access-Control-Allow-Origin` - 必选，允许跨域的域名（通配符`*`或者单域名）

`Access-Control-Allow-Methods` - 必选，允许跨域的 HTTP 方法

`Access-Control-Allow-Headers` - 当预请求中包含 `Access-Control-Request-Headers` 时必须包含，逗号分隔，所有支持的头部

`Access-Control-Allow-Credentials` - 可选，要么不写，要么是`true`，要和 `withCredentials` 保持一致

`Access-Control-Max-Age` - 可选
