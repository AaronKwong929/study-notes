# call apply 的区别

都是用于改变执行函数的上下文（即改变 this 的指向

调用 call 和 apply 的对象必须是一个函数 Function（即 this 指向这个 function，不传默认为 window

call 和 apply 效果完全一样，只是入参有区别

```js
// call
var obj = { name: `aa` };
function a(firstName, lastName) {
  console.log(firstName, this.name, lastName);
}

a.call(obj, `bb`, `cc`); // bb aa cc
```

```js
// apply
var obj = { name: `aa` };
function a(firstName, lastName) {
  console.log(firstName, this.name, lastName);
}

a.apply(obj, [`bb`, `cc`]); // bb aa cc
```

call 是将从第二个开始的参数都映射到 function 的对应位置上

apply 则是将第二个参数（数组/类数组等 映射到 function 对应的位置

类数组：具备与数组特征类似的对象，可

```js
var obj = {
  0: 1,
  1: 2,
  2: 3,
  length: 3,
};
```

## 手写实现

1. call

```js
Function.prototype.myCall = function (context, ...args) {
  if (typeof context !== "function") throw new TypeError(``);

  const fn = Symbol(`fn`);
  context = context || window;
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};
```

2. apply

```js
// 其实就是参数获取方式不同
Function.prototype.myApply = function (context, args) {
  if (typeof context !== "function") throw new TypeError(``);

  const fn = Symbol(`fn`);
  context = context || window;
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};
```
