# Docker + Nginx 搭建静态资源服务器

> 这也是一篇之前在公众号发布的内容，迁移过来

## 前言

之前做毕设的个人博客项目的时候，是使用了 koa-static 去处理 vue 打包出来的文件的；包括之前使用 Nest.js 重构博客后台的时候，也是用的 nest 的@nestjs/serve-static 下的 ServeStaticModule 来处理静态资源，在每次后台 web 端更新时都需要重新打包一次文件以后，上传到服务器的后端服务根目录下，直接用服务器还好~后面使用 docker 重构的时候就发现问题来了：每次前端重新打包后都需要重新丢到后端根目录，然后需要重新打包镜像，这就直接打击开发热情，懒得更新了。用 docker+nginx 实现一个静态资源服务器，每次只需要将打包出来的文件丢到静态资源文件夹下，就可以通过域名/IP 直接访问，方便快捷。

## 原理（？）

1. Nginx 监听 80/443 端口，并把 http-server-root 指向服务器上的静态资源目录，实现静态资源服务器。

2. 将 Nginx 部署到 Docker 上，并使用 docker-compose 一步到位完成部署。也可以不使用 docker-compose，毕竟只有单个服务，（这里我是偷懒不想每次启动都写 docker 命令）。

## 实现步骤

这里我是直接用 docker 部署的，直接将 nginx 部署在服务器上也可以参考

1. 服务器上新建文件夹 /project/nginx/

2. /project/nginx/下有以下文件，其中 nginx.conf 和 mime.types 用于映射到 docker 容器里的/etc/nginx/，作为 nginx 的配置文件

![nginx-config-files](https://raw.githubusercontent.com/AaronKwong929/pictures/master/20210418220003.png)

3. 编写 nginx.conf

注意这里，这个文件是挂载到容器内部/etc/nginx/里的，所以文件目录的写法都要以容器内部路径为准。

**重点部分**：root 指定为我服务器的静态资源目录；没有启用 https 所以只监听了 80 端口；

```conf
http {
    include mime.types;
    default_type application/octet-stream;

   server {
    listen 80;
    server_name localhost;
    location / {
     root   /project/static;
     index  index.html index.htm;
     }
    }
}
```

题外话：这里可以设置缓存策略，避免发版后需要强刷才可以获取到新的内容，具体的说明看[这篇](build/fixing-compulsory-refresh.md)

4. 编写 docker-compose.yml（不使用 compose 的可以跳过这一步）

```yml
version: "3.7"
services:
  nginx:
    user: root
    container_name: static_server
    image: nginx
    ports:
      - 80:80
    volumes:
      - /project:/project
      - /project/nginx:/etc/nginx
```

root角色，name随意，image指定nginx，监听80端口，需要https的另起一行443:443，将/project文件夹挂载到容器内部，nginx设置挂载到/etc/nginx中；

然后在/project/nginx/下输入 docker-compose up -d 打开链接，/test 是我打包出来的一个测试包。

## 测试

![test](https://raw.githubusercontent.com/AaronKwong929/pictures/master/20210418220434.png)

可见直接访问ip/test/是能够访问到我打包的内容的
## 结束

如果不使用 docker-compose，单独输入 docker 命令的话，直接输入下面这行即可

```bash
docker run --name static_server -d -p 80:80 -v /project:/project -v /project/nginx:/etc/nginx nginx
```

static_server 指定容器名，最后的 nginx 指定镜像,-d 指定后台运行， 第一个 -v 指定监听文件夹，第二个 -v 指定 Nginx 配置文件
