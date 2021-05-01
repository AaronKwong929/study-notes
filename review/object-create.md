# 手写 object.create

```js
var create = function (ctx) {
  var obj = {};
  obj._proto__ = ctx;
  return obj;
};
```

```js
var create = function (ctx) {
  function F() {}
  F.prototype = ctx;
  F.prototype.constructor = F;
  return new F();
};
```
