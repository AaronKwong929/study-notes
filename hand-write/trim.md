# 实现 trim 函数

两次正则 replace 替换 - 浏览器有优化

```js
String.prototype.trim = function () {
  return this.replace(/^\s\s*/, ``).replace(/\s\s*$/, ``);
};
```
