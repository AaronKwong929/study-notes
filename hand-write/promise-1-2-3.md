# 使用 Promise 实现隔秒输出 1 2 3

```js
// 使用Promise实现每隔一秒输出1 2 3
const arr = [1, 2, 3];
arr.reduce(
  (pre, cur) =>
    pre.then(
      () =>
        new Promise(r =>
          setTimeout(() => {
            console.log(cur);
            r();
          }, 1000)
        )
    ),
  Promise.resolve()
);
```
