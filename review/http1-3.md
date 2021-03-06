# http/123

- http1

  - 缺点

    - 缓存 expires 是根据本地时间判断的，本地时间可以被修改

    - 每个资源都要建立 TCP 连接，且是串行请求

- http 1.1

  - 特点

    - 添加了 header-host

    - options 方法

    - keepalive 重用 TCP 连接

    - Cache-Control 机制，详情见[缓存](/review/网页缓存.md)

  - 缺点

    - 虽然重用 tcp，但是请求还是串行发送的

    - 数据传输成本大：1.1 传输数据时，是以文本的方式，借助耗 CPU 的 zip 压缩的方式减少网络带宽，但是耗了前端和后端的 CPU

- http/2

  - 特点

    - 二进制分帧：增加数据传输效率

    - 多路复用：可以在一个 TCP 链接中并发请求多个 HTTP 请求，移除了 HTTP/1.1 中的串行请求。

    - 头部压缩：如果同时发出多个请求，他们的头是一样的或是相似的，协议会消除重复的部分（HPACK 算法

    - 推送缓存：没有请求 但要用到的东西，服务端先推送过来缓存

  - 缺点

    - tcp 建立连接耗时长，拥塞控制

    - tcp 层会有队头阻塞问题（若干个请求复用一个 tcp 连接，若一个请求发生丢包，所有请求都要等待重传（head of line blocking

- http/3

  - 特点

    - 基于 UDP 的 QUIC quick udp internet connections（udp 不管丢包/顺序）

    - http 三次握手 + tls 三次握手 合并

## http1.1 的 keep-alive 和 http2 的多路复用的区别

HTTP/1.x 是基于文本的，只能整体去传；HTTP/2 是基于二进制流的，可以分解为独立的帧，交错发送

HTTP/1.1 keep-alive 必须按照请求发送的顺序返回响应；HTTP/2 多路复用不按序响应

HTTP/1.1 keep-alive 为了解决队头阻塞，将同一个页面的资源分散到不同域名下，开启了多个 TCP 连接；HTTP/2 同域名下所有通信都在单个连接上完成

HTTP/1.1 keep-alive 单个 TCP 连接在同一时刻只能处理一个请求（两个请求的生命周期不能重叠）；HTTP/2 单个 TCP 同一时刻可以发送多个请求和响应

## 为何 http/2 没有解决队头阻塞问题

http/2 没有解决 tcp 队头阻塞

http/1 请求串行发送/响应导致的`http队头阻塞`

http/2 的分帧是给每个帧打上`流ID`避免依次响应，对方接收到帧后根据流 ID 拼凑出流，就可以多路复用/乱序发送，解决`http队头阻塞`

http 协议在应用层，tcp 协议在传输层，tcp 传输过程可能会丢包，就要等待重传，所以会发生`tcp队头阻塞` -- 滑动窗口没有彻底解决这个问题

## http 常见 header 字段

- cookie

- allow

- e-tag

- last-modified

- keep-alive

- location

- content-type

- content-encoding

## get post 区别

get - 获取，post - 创建

get 参数被拼接到 url，post 放在请求体

get 请求 url 长度可能受浏览器控制

## session 和 cookie

session 在服务端，cookie 在客户端

session 默认存放文件而非内存
