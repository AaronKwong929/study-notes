# 常见的一些 HTTP 状态码

## 2 开头

200 请求成功，`强缓存`命中返回的状态码

202 Accepted 已收到请求未响应

204 No Content 处理了请求但不需要返回任何信息

## 3 开头

301 Moved Permanently 永久重定向，会被缓存

302 Found 临时重定向，不会缓存，暂时不能访问该 url

304 Not Modified `协商缓存`命中时服务器返回的状态码

## 4 开头

400 Bad Request 参数有误，被服务器 reject

401 Unauthorized 认证错误

403 Forbidden 服务器理解请求，但拒绝执行

404 Not Found

405 Method Not Allowed 请求方法有误，例如 get 请求接口发送了 post 请求

429 Too Many Requests 请求速率过高（ 见于 Sentry 触发错误次数过多）

## 5 开头

500 Internal Server Error 接口爆炸

502 Bad Gateway 网关错误（常见于正在发版）

503 Service Unavailable 服务器过载

504 Gateway Timeout DNS 解析超时

## 一些容易混淆的

204 和 304：204 执行成功但没有数据，可以用于执行成功而不需要传输多余信息（不过也比较少用）；304 是命中协商缓存

401 和 403：401 无认证或认证失败，可以通过增加认证解决；403 通过认证，但没有权限去访问

502 和 503：502 见于服务器在发版，503 见于服务器过载崩溃
