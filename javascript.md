# 关于 js 遇到的一些问题

localStorage 在设置内容时，如果值没有发生变化，则不会触发 storage 事件

解决方法：

```js
localStorage.setItem(key, JSON.stringify({ val, timestamp: new Date() }));
```

虚拟 dom 有什么用

dom 更新可能导致页面重绘/重排

减少直接操作 dom ，js 计算性能换取 dom 性能

虚拟 dom 不依赖浏览器环境，移动端开发 / 服务端渲染
