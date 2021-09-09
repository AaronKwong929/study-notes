# Koa-compose 学习记录

## 洋葱模型示例

```js
const Koa = require('koa');
const app = new Koa();

app.use((ctx, next) => {
  console.log(`1 开始`);
  next();
  console.log(`1 结束`);
});

app.use((ctx, next) => {
  console.log(`2 开始`);
  next();
  console.log(`2 结束`);
});

app.use((ctx, next) => {
  console.log(`响应`);
  ctx.body = `abcd`;
});

app.listen(7001, () => {});
```

输出如下：

```js
// 1开始
// 2开始
// 响应
// 2结束
// 1结束
```

符合`洋葱模型`外->里，里->外的效果

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210909152432.png)

## compose 源码

```js
function compose(middleware) {
  if (!Array.isArray(middleware))
    throw new TypeError('Middleware stack must be an array!');
  for (const fn of middleware) {
    if (typeof fn !== 'function')
      throw new TypeError('Middleware must be composed of functions!');
  }
  // ...
}
```

先判断 compose 传入的 middleware 是不是数组（中间件数组集合），如果不是的话就报错

然后对每一项进行遍历，判断是不是`function`不是的话也要报错

`compose`返回函数，保存当前中间件调用索引，`dispatch`方法包装成 Promise

```js
function compose(middleware) {
  // ...
  return function (context, next) {
    let index = -1;
    return dispatch(0);

    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times')); // 判断传入的 i 和 index 比对，防止单个中间件内多次调用 next()
      index = i;
      let fn = middleware[i]; // 中间件 index 越界，返回 undefined
      if (i === middleware.length) fn = next; // 将 next 传给 fn
      if (!fn) return Promise.resolve(); // 如果没有传 next 方法，直接 Promise.resolve 结束 compose 执行
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1))); // 这里即是 (ctx, next)，bind 返回的是函数 不会立即执行
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```
