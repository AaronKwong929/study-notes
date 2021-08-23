# Promise 实现并发控制

维护 index 和 res 数组，一个 helper 函数，在`index === promises.length - 1`时候 resolve 掉

函数开始执行的时候将 helper 填充到并发池里（for 循环）

在 finally 里判断是否完成 promise 否-> 再进行一次 helper

```js
function solve(promises, limit) {
  const index = limit; // 初始化应该从 limit 下标开始
  const resArr = [];

  return new Promise(resolve => {
    const helper = (item, i) => {
      item()
        .then(
          data => {
            resArr[i] = data;
          },
          err => {
            resArr[i] = err;
          }
        )
        .finally(() => {
          if (index < promises.length - 1) {
            helper(promises[index]);
            index++;
          } else if (index === promises.length - 1) resolve(resArr);
        });
    };

    for (let i = 0; i < limit; i++) helper(promises[i], i);
  });
}
```
