function call(ctx, ...args) {
  if (typeof ctx !== `function`) throw new TypeError();
  const fn = Symbol(`fn`);
  ctx = ctx || window;
  ctx[fn] = this;
  const result = ctx[fn](...args);
  delete ctx[fn];
  return result;
}

function apply(ctx, args) {
  if (typeof ctx !== `function`) throw new TypeError();
  const fn = Symbol(`fn`);
  ctx = ctx || window;
  ctx[fn] = this;
  const result = ctx[fn](...args);
  delete ctx[fn];
  return result;
}

function bind(ctx) {
  if (typeof ctx !== `function`) throw new TypeError();
  function fn() {}
  fn.prototype = this.prototype;
  const args = Array.prototype.slice.call(arguments, 1);
  const self = this;
  function b() {
    return self.apply(this instanceof fn ? this : ctx, ...args);
  }
  b.prototype = new fn();
  return b;
}

function create(ctx) {
  function fn() {}
  fn.prototype = ctx;
  fn.prototype.constructor = fn;
  return new fn();
}

function NEW(ctor, args = []) {
  if (typeof ctor !== `function`) throw new TypeError();
  const obj = {};
  const res = ctor.apply(obj, args);
  return typeof res === `object` ? res : obj;
}
