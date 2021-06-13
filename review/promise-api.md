# Promise 各个 api 手写实现

## Promise.prototype.finally

无论成功和失败都会将值继续往下传递

回调不接受参数

```js
Promise.prototype.finally = function (onFinished) {
  return this.then((val) => {
    onFinished();
    return val;
  }).catch((err) => {
    onFinished();
    return err;
  });
};
```

## Promise.prototype.catch

使用 promise 的 then 方法将失败的回调传入即可

```js
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};
```

## Promise.resolve

```js
Promise.resolve = function (val) {
  return new Promise((resolve) => {
    resolve(val);
  });
};
```

## Promise.reject

```js
Promise.reject = function (val) {
  return new Promise((resolve, reject) => {
    reject(val);
  });
};
```

## Promise.all

接受的是 promise 类数组

返回一个 promise 实例

返回的 promise 实例 resolve 回调结果是数组类型，包含了所有传入的 promise 的结果。

返回的 promise 实例 reject 回调结果就是第一次报错的结果。

```js
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    const helper = (i, data) => {
      result[i] = data;
      if (++i === promises.length) {
        resolve(result);
      }
    };

    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i])
        .then((data) => {
          helper(i, data);
        })
        .catch((err) => reject(err));
    }
  });
};
```

## Promise.race

其中一个 resolve/reject 即可

```js
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let promise of promises) {
      promise.then(resolve, reject);
    }
  });
};
```

## Promise.any

```js
Promise.any = function (promises) {
  return new Promise((resolve, reject) => {
    let errCount = 0;
    let count = 0;
    for (let promise of promises) {
      count += 1;
      Promise.resolve(promise).then(
        resolve
        (err) => {
          errCount += 1;
          if (errCount >= count) {
            reject(new AggregateError("All promises were rejected"));
          }
        }
      );
    }
  });
};
```

## Promise.allSettled

```js
Promise.allSettled = function (promises) {
  return new Promise((resolve, reject) => {
    let index = 0;
    let finishedCount = 0;
    const result = [];

    const wrapFulfilled = (i) => {
      return (val) => {
        finishedCount++;
        result[i] = {
          status: `fulfilled`,
          value: val,
        };
        if (finishedCount >= index) {
          resolve(result);
        }
      };
    };

    const wrapRejected = (i) => {
      return (err) => {
        finishedCount++;
        result[i] = {
          status: `rejected`,
          reason: err,
        };
        if (finishedCount >= index) {
          resolve(result);
        }
      };
    };

    for (let promise of promises) {
      Promise.resolve(promise).then(wrapFulfilled(index), wrapRejected(index));
      index += 1;
    }
  });
};
```
