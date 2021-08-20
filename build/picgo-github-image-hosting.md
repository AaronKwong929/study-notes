# 使用 PicGo 和 GitHub 搭建一个图床

## 前言/题外话

21 年一月初写的文章了，之前发布在公众号，但是公众号的图片都不能引用外链，我本来上传在 GitHub 图床的图片全部都要额外上传到公众平台，嫌太麻烦了。后面发现了 Docsify 这个东西，于是逐步将之前写的内容迁移过来，公众号就当个生活记录算了～

## 安装 PicGo

首先前往 [PicGo 的 GitHub](https://github.com/Molunerfinn/PicGo)下载一份最新版/稳定版的 GitHub。安装过程全部默认即可，这里懒得上图了。

## GitHub 配置

1. 先去 GitHub 开一个新仓库，如图所示。

![new-git-hub-repo](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/2021-01-18-16-42-51.png)

2. 然后配置一个 GitHub Token，如下列图所示。

- 2.1 打开配置

![github-settings](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/2021-01-18-16-44-22.png)

- 2.2 打开 Developer Settings

![github-settings-developer-settings](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/2021-01-18-16-44-44.png)

- 2.3 打开 Personal Access Tokens

![open-personal-access-tokens](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/2021-01-18-16-45-23.png)

- 2.4 创建一个 PicGo 专用 Token

![new token](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/2021-01-18-16-46-12.png)

**这个 Token 只会出现一次，要自己记下来，以防以后重新搭建要用到**

## 集成

1. 打开 PicGo 配置

![picgo-configs](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/2021-01-18-16-47-43.png)

修改一下 PicGo 的配置，如图所示，改成上传自动重命名成时间戳

![picgo-config](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/2021-01-18-16-55-04.png)

## 完成

到这里就完成了 PicGo+GitHub 的配置了，配合 Docsify 做一个静态个人博客，使用 VSCode 做 markdown lint 以及接入 GitHub page，完全打通整套博客环境。

## 补充

国内访问 github 的图片大概率被墙，小伙伴反应说图片全裂，折腾了一晚上腾讯云 COS 没成功，后来得到指点其实可以使用 jsdelivr 加速 github，不需要梯也能看到图片了，具体操作就是将图片 url 链接做一下全局替换

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210424205958.png)

https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/

https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/

https://cdn.jsdelivr.net/gh/${user}/${repo}@${version}/${file}

没区分版本号不用写@version

## P.S.

可以额外对 VSCode 和 Typora 进行 PicGo 集成，配置比较简单就不写了（懒
