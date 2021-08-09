# XSS 攻击

> XSS Cross Site Scripting 跨站脚本攻击 区分于 CSS。黑客往 Html 或者 DOM 注入恶意脚本的攻击手段

- 窃取 cookie 模拟登陆：document.cookie 发送给服务器

- 监听用户行为：监听键盘

- 修改 DOM 引导用户输入信息

- 恶意弹窗

## 注入方法

- 存储型 xss

  - 将恶意代码存到漏洞服务器中

  - 用户请求含有恶意代码的页面，恶意代码上传 cookie 到自己服务器

- 反射型 xss

-

- 基于 dom 的 xss

## 如何阻止

1. 服务器对输入脚本进行过滤 / 转码

2. 利用 CSP cross site policy

   - 禁止加载其他域下资源

   - 禁止向第三方域提交数据

   - 禁止执行内联脚本

3. cookie 的 HttpOnly

   - 无法通过 js 获取到 cookie
