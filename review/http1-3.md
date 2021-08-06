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

    - 数据传输成本大：HTTP/1.1 传输数据时，是以文本的方式，借助耗 CPU 的 zip 压缩的方式减少网络带宽，但是耗了前端和后端的 CPU

- http/2

  - 特点

    - 二进制分帧：增加数据传输效率

    - 多路复用：可以在一个 TCP 链接中并发请求多个 HTTP 请求，移除了 HTTP/1.1 中的串行请求。

    - 头部压缩：如果同时发出多个请求，他们的头是一样的或是相似的，协议会消除重复的部分（HPACK 算法

    - 推送缓存：没有请求 但要用到的东西，服务端先推送过来缓存

  - 缺点

    - tcp 建立连接耗时长，拥塞控制

    - tcp 层会有对头阻塞问题（若干个请求复用一个 tcp 连接，若一个请求发生丢包，所有请求都要等待重传（head of line blocking

- http/3

  - 特点

    - 基于 UDP 的 QUIC quick udp internet connections（udp 不管丢包/顺序）

    - http 三次握手 + tsl 三次握手 合并
