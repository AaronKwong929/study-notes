Function.prototype.myBind = function (ctx) {
  if (typeof ctx !== `function`) throw new TypeError();
  const self = this; // 存起当前 this
  const fn = function () {}; // 空函数
  const args = Array.prototype.slice.call(arguments, 1);
  const bind = function () {
    return self.apply(this instanceof fn ? this : ctx, [...args, ...arguments]); // new?
  };
  fn.prototype = this.prototype; // 空函数中转prototype
  bind.prototype = new fn(); // 改变原型
  return bind;
};
