# 将 GitHub Page CNAME 到个人域名

> 就可以不用翻墙也能访问啦

买域名

我选择了腾讯云的，购买完成后进到腾讯云的`域名控制台`

实名制（重要）

买完域名后必须要去实名制，不实名制的话无法正确解析，半天白折腾了

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210819112845.png)

等待实名制通过后，进入网页解析界面(DNSPOD)，并添加以下两条解析记录

顺便把 SSL 也开了

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210819112919.png)

右侧 SSL 点进去申请证书即可，十分方便

记录值不需要填写 io 后面的内容

在自己的仓库下创建一个`CNAME`文件，全大写无后缀

把域名填进去，推送

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210819112551.png)

然后打开 github 仓库，settings page

应该会自动填好了 cname

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210819112645.png)

然后等它解析成功后把 https 也钩上**注意：一定要实名制完成后才会解析成功**

大功告成，稍等片刻之后就可以通过自己的域名访问了

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210819112738.png)

直接使用原来的 github io 也会被重定向到对应域名
