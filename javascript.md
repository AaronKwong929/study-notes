# 关于 js 遇到的一些问题

localStorage 在设置内容时，如果值没有发生变化，则不会触发赋值

解决方法：

```js
localStorage.setItem(key, JSON.stringify({ val, timestamp: new Date() }));
```
