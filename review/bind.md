# bind

bind() 创建一个新的函数，在调用时设置 this 为提供的值，在调用新函数时，将给定列表作为原函数的参数

bind 同 apply 和 call（改变 this 指向），但会返回一个新的函数，并且不会自动执行

即： 返回一个函数 / 可以传入参数

## 返回一个函数

```js
var foo = {
  value: 1,
};
function bar() {
  console.log(this.value);
}
var bindFoo = bar.bind(foo);
bindFoo(); // 1
```

### 使用 call /apply 实现 bind

```js
Function.prototype.bind2 = function (ctx) {
  var self = this;
  return function () {
    self.apply(ctx);
  };
};
```

## 传入参数

```js
var foo = {
  value: 1,
};
function bar(name, age) {
  console.log(this.value);
  console.log(name);
  console.log(age);
}
var bindFoo = bar.bind(foo, `abc`);
bindFoo(18); // 1, abc, 18
```

### 改进 1

```js
Function.prototype.bind2 = function (ctx) {
  var self = this;
  // 第一个参数是 ctx，后面的参数才是入参
  var args = Array.prototype.slice.call(arguments, 1);
  return function () {
    // 这里的 arguments 指的是bind返回的函数传入的参数
    var bindArgs = Array.prototype.slice.call(arguments);
    self.apply(ctx, args.concat(bindArgs));
  };
};
```

## 关于 new

当 bind 返回的函数作为构造函数时，原先指定的 this 失效，但入参有效

### 举例

```js
var value = 2;
var foo = {
  value: 1,
};
function bar(name, age) {
  this.habbit = `shopping`;
  console.log(this.value);
  console.log(name);
  console.log(age);
}
bar.prototype.friend = `aa`;
var bindFoo = bar.bind(foo, `daisy`);

var obj = new bindFoo(18);
console.log(obj); // undefined, daisy, 18
console.log(obj.habbit); // shopping
console.log(obj.friend); // aa
```

new -> this 最高优先级指向，指向 obj，obj.value === undefined

### 优化 2

```js
Function.prototype.bind2 = function (ctx) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    // 普通函数的时候 this指向 window， 此时走 false 指向 bind 的第一个参数

    // 如果是构造函数，this指向的是fBound，
    return self.apply(
      this instanceof fBound ? this : ctx,
      args.concat(bindArgs)
    );
  };

  // 继承绑定函数 原型里的值
  fBound.prototype = this.prototype; // === self.prototype

  return fBound;
};
```

### 优化 3

优化 2 中直接将 ctx.prototype 赋值给 fBound.prototype，是引用，修改 fBound.prototype 的时候也会影响到 ctx.prototype

用空函数来中转

```js
Function.prototype.bind2 = function (ctx) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fNOP = {};

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);

    return self.apply(this instanceof fNOP ? this : ctx, args.concat(bindArgs));
  };

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
```
