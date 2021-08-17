# 实现 call bind apply

## call 和 apply

改变函数执行的上下文(改变 this 指向)

call 与 apply 内部执行一致，只有传入参数的方式不一样

```js
Function.prototype.myCall = function (context, ...args) {
  // 如果 context 不是函数要抛出错误
  if (typeof context !== `function`) throw new TypeError();

  const fn = Symbol(`fn`); // 防止和 context 原有的属性冲突
  context = context || window; // 如果没有明确指出 context，则指向window
  context[fn] = this; // this 指调用这个 myCall 的函数
  const result = context[fn](...args); // 调用结果
  delete context[fn]; // 执行完成后删除新增的属性
  return result; // 返回结果
};
```

```js
// apply 实现方法基本一致，除了参数的传入
Function.prototype.myApply = function (context, args /* NOTE: 还有这里 */) {
  if (typeof context !== `function`) throw new TypeError();
  const fn = Symbol(`fn`);
  context = context || window;
  context[fn] = this;
  const result = context[fn](...args); // NOTE: 注意这里
  delete context[fn];
  return result;
};
```
