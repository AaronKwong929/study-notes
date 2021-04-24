# 让 Nginx 正确返回错误的请求

## 现象

走域名反向代理之后，诸如 502 / 404 之类的错误被 Nginx 转发后，到前端的却是报 CORS 错误，导致 Axios 无法正确响应拦截

## 原因

查阅[Nginx 文档](http://nginx.org/en/docs/http/ngx_http_headers_module.html)，

> Adds the specified field to a response header provided that the response code equals 200, 201 (1.3.10), 204, 206, 301, 302, 303, 304, 307 (1.1.16, 1.0.13), or 308 (1.13.0). Parameter value can contain variables.

> There could be several add_header directives. These directives are inherited from the previous configuration level if and only if there are no add_header directives defined on the current level.

> If the always parameter is specified (1.7.5), the header field will be added regardless of the response code.

即 Nginx add_header 只会追加到以上响应状态码的响应头上面。

## 解决方案

在 Nginx 的跨域配置里面加上 always

```conf
add_header Access-Control-Allow-Origin * always;
add_header Access-Control-Allow-Methods * always;
```

## 其他

前端跨域请求会先发送预检请求查询该方法能否使用 ，options 请求可以做一点额外的操作

```conf
if ($request_method = OPTIONS) {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods *;
    add_header Access-Control-Allow-Credentials true;
    return 204;
   }
```
