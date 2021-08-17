# 实现 Object.create

`Object.create`是以参数为原型去创建一个对象

```js
const create = function (ctx) {
  function F() {}
  F.prototype = ctx;
  F.prototype.constructor = F;
  return new F();
};
```
