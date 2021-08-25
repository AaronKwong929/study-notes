# 实现 bind

```js
function myBind(ctx, ...args) {
  if (typeof ctx !== `function`) throw new TypeError();
  const self = this;
  function fn() {}
  fn.prototype = ctx.prototype;
  function bind(..._args) {
    return self.apply(this instanceof fn ? this : ctx, [...args, ..._args]);
  }
  bind.prototype = new fn();
  return bind;
}
```

this 是 fn 实例的话证明使用了 new 操作符
