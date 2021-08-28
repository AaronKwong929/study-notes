# 关于同源策略

同`协议 域名 端口`可以相互访问资源和操作 DOM

表现在`DOM Web数据 网络` 三个层面

- DOM

  - 限制不同源 js 脚本对当前 DOM 的读和写

- 数据

  - 限制不同源站点读取当前站点 cookie，indexDB，LocalStorage 等数据

- 网络

  - 限制通过 XMLHttpRequest 将数据发给不同源的站点
