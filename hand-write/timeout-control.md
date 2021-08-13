# 实现一个超时控制

## 基本原理

`Promise.race` + 睡眠函数

## 版本 1 Promise Api

```js
//  睡眠函数到点 reject
const sleep = timeout =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      reject(`timeout`);
    }, timeout)
  );

// 将 promise 包装成一个带超时控制的
const timeoutPromise = (requestFn, timeout) =>
  Promise.race([requestFn, sleep(timeout)]);
```

### 测试

```js
// 测试
// 模拟一个异步请求函数
function createRequest(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('done');
    }, delay);
  });
}

// 超时的例子
timeoutPromise(createRequest(2000), 1000).catch(error => console.error(error));
// 不超时的例子
timeoutPromise(createRequest(2000), 3000).then(res => console.log(res));
```

## 版本 2 手写 race

手写 race 其实简单，将 promise 列表的每个内容 resolve/reject，只有最快的可以将包裹的外层 promise resolve，promise 一旦 resolve/reject 就不会再改变状态，后完成的结果会被抛弃

```js
const timeoutPromise2 = (requestFn, timeout) => {
  const promises = [requestFn, sleep(timeout)];
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      promise.then(resolve, reject);
    }
  });
};
```
