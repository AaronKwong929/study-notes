# Docker + Jenkins 搭建持续构建系统

> 这个搭建建立在云服务器已有 docker 和 docker-compose 的条件下，没有的话需要先安装

## 搭建 Jenkins 步骤

1. 进入云主机，找到一个目录，创建 jenkins 文件夹

```bash
mkdir jenkins
cd jenkins
mkdir jenkins_home
```

2. 创建一个 docker-compose.yml 文件

```bash
vim docker-compose.yml
```

3. 写入 docker-compose.yml

```yml
version: "3" # 指定 docker-compose.yml 文件的写法格式
services:
  docker_jenkins:
    user: root # 为了避免一些权限问题 在这我使用了root
    restart: always # 重启方式
    image: jenkins/jenkins:lts # 指定服务所使用的镜像
    container_name: jenkins # 容器名称
    ports: # 对外暴露的端口定义
      - "8080:8080"
      - "50000:50000"
    volumes: # 卷挂载路径
      - /project/jenkins/jenkins_home/:/var/jenkins_home # 这是一开始创建的目录挂载到容器内的 jenkins_home 目录
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker # 这是为了可以在容器内使用 docker 命令
      - /usr/local/bin/docker-compose:/usr/local/bin/docker-compose # 同样的这是为了使用 docker-compose 命令
```

4. 然后启动 Jenkins 服务

```bash
docker-compose up -d
```

5. 等待服务启动完成后，打开 xxx.xxx.xxx.xxx:8080（jenkins 默认启动端口，xxx 是云服务器的 ip

6. 加载完成后要求输入初始启动密码

初始密码就在挂载卷 xxxx/jenkins/jenkins_home 中对应的文件夹

7. 安装推荐配置 - 完成后进入主界面 接下来开始搭建持续构建部分

## 搭建持续集成项目
