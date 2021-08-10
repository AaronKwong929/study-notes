# CSRF

> Cross-site Request Forgery 跨站请求伪造。利用用户登录状态到第三方站点

1. 自动发起 get 请求

将恶意链接放在 img 的 src 里，加载 img 的时候就会请求链接

2. 自动发起 post 请求

打开站点后隐藏的表单自动提交

3. 引诱点击恶意链接

## 防范方法

1. cookie samesite 属性

- samesite 有 strict lax none 三个选项

  - strict 完全禁用第三方使用 cookie

  - lax 在第三方使用 get 可以使用 cookie post 不行

  - none 任何情况都可以发送

2. 验证请求来源站点

http 请求头的 refer 和 origin 属性

refer 记录请求来源地址，包含路径信息

origin 不包含路径信息

没有 origin 再判断 refer

3. csrf token 服务器返回，敏感操作时要发送服务器验证，第三方发出无法获得到 token
