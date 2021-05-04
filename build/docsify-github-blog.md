# 使用 Docsify + GitHub 搭建一个静态个人博客

## 实现步骤

### 安装 Docsify

```bash
npm install docsify-cli -g
```

### 初始化

创建一个文件夹并且初始化 git 仓库

```bash
docsify init ./docs
docsify serve
```

这样就可以在本地跑文档了

### 插件

插件不多说，自行去[docsify 官网](https://docsify.js.org/#/zh-cn/configuration)查找插件即可

### 分文件夹存放内容

写入的 markdown 文件不一定都要放在根目录下，可以像下图这样，分开文件夹存放
![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210504215414.png)

\_sidebar.md 里的链接只需要加上文件夹名称即可

```md
[组件](components/README.md)
```

### 推送到 github

自行创建仓库存储

### 部署 Github Page

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210504220017.png)

然后静候几分钟，等待 github 部署，之后就可以直接访问

https://aaronkwong929.github.io/study-notes/

看自己存储上传的笔记了！

配合 PicGo 和图床仓库以及 jsDelivr 加速，整个在线笔记平台就完成了
