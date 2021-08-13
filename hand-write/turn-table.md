# Promise 实现转盘问题

## 基本原理

`Promise.all` 都执行完成后返回结果

## 版本 1 Promise.all

```js
const sleep = delay =>
  new Promise(resolve => setTimeout(() => resolve(delay), delay));

const turnTablePromise = (requestFn, animationTime) =>
  Promise.all([requestFn, sleep(animationTime)]);

// 模拟一个异步请求函数
function createRequest(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('done');
    }, delay);
  });
}
```

### 测试

```js
// 请求比转盘动画快
turnTablePromise(createRequest(2000), 5000).then(res => console.log(res));

// 请求比转盘动画慢
turnTablePromise(createRequest(2000), 1000).then(res => console.error(res));
```

## 版本 2 手写 Promise.all

难度还行，维护一个 `result` 数组，promise 每一个 then 走成功回调的时候调用`helper`将成功结果放到 result 里面，当索引+1 等于 promises 长度时即完成全部 promise ，resolve

```js
const turnTablePromise = (requestFn, animationTime) => {
  const promises = [requestFn, sleep(animationTime)];
  return new Promise((resolve, reject) => {
    const result = [];
    const helper = (i, data) => {
      result[i++] = data;
      if (i === promises.length) {
        resolve(result);
      }
    };

    for (let i = 0; i < promises.length; i++) {
      promises[i].then(res => helper(i, res), reject);
    }
  });
};
```
