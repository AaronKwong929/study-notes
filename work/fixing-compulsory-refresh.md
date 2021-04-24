# 解决发版后需要强制刷新以获取更新内容的问题

## 现象

每次页面打包部署后需要用户去清除缓存 CTRL + F5 进行刷新，才可以获取到新的内容，这是不合理的。

## 出现原因

虽然 vue 每次打包出来的文件都有哈希值确保唯一，入口文件 index.html 也指向最新的打包文件，但是 index.html **没有更改名字** 依然是 index.html，这就会被缓存起来，导致每次刷新后页面请求的状态码都是 304，即采用了缓存。

## 解决方法

知道了问题的原因即可对症下药，只要不对 index.html 进行缓存就行了，走 ip 的话只需要在我们的 index.html 加入以下 meta

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

如果走域名的话则需要去 nginx 进行配置

```conf
location ~ .*\.(htm|html)$
    {
        add_header Cache-Control "private, no-store, no-cache, must-revalidate, proxy-revalidate";
    }

```

## 结束

再次进行页面刷新 请求状态码变成了 200，即是重新获取的最新内容
