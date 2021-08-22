# 新服务器安装 docker 和 docker-compose

```sh
$ sudo yum update
$ sudo yum install -y yum-utils \
 device-mapper-persistent-data \
 lvm2

$ sudo yum-config-manager \
 --add-repo \
 https://download.docker.com/linux/centos/docker-ce.repo

$ sudo yum update
$ sudo yum install docker-ce

sudo usermod -aG docker root 加入用户组

systemctl start docker
d
systemctl enable docker

https://github.com/docker/compose/releases/latest

curl -L https://github.com/docker/compose/releases/download/XXX.XXX.XXX/docker-compose-`uname -s`-`uname -m` -o /usr/bin/docker-compose

chmod +x /usr/bin/docker-compose
```

https://www.cnblogs.com/lz0925/p/11787216.html
