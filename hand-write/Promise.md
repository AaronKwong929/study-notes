# 手写 Promise 及其全家桶

## Promise 的基本结构

```js
const PromiseStatus = {
  Pending: `pending`,
  Fulfilled: `fulfilled`,
  Rejected: `rejected`,
};

class Promise {
  constructor(executor) {
    this.status = PromiseStatus.Pending;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {}

    const reject = reason => {}

    then(onFulfilled, onRejected) {}
  }

  static resolve(value) {} // Promise.resolve();

  static reject(reason) {} // Promise.reject();

  static deferred() {} // 用于Promise A+ test 的静态方法
}

module.exports = MyPromise;
```

## 各个位置的细节

### resolve 和 reject

只有在 Promise 是`pending`状态才可以执行，调用时改变 promise 的状态，并且回调队列里的任务按注册顺序依次执行

根据 Promise A+，resolve 和 reject 需要异步执行，这里我们用 setTimeout 模拟异步

```js
// 只有在 pending 状态才会执行
// 调用 resolve 后，状态改为 fulfilled
// 将 value 值赋给 this.value
class MyPromise {
  constructor(executor) {
    // ....
    const resolve = value => {
      if (this.status === PromiseStatus.Pending) {
        setTimeout(() => {
          this.status = PromiseStatus.Fulfilled;
          this.value = value;
          this.onFulfilledCallbacks.forEach(fn => {
            fn(value);
          });
        }, 0);
      }
    };
    // same here
    const reject = reason => {
      if (this.status === PromiseStatus.Pending) {
        setTimeout(() => {
          this.status = PromiseStatus.Rejected;
          this.reason = reason;
          this.onRejectedCallbacks.forEach(fn => {
            fn(reason);
          });
        }, 0);
      }
    };
    // ...
  }
}
```

### 立即执行（用 try catch 包裹）

有可能用户输出写错的

```js
new Promise((resove, reject) => {
  console.log(a); // <== undefined
});
```

所以要用 try 包裹

```js
class MyPromise {
  constructor(executor) {
    // ...
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
    // ...
  }
}
```

### 实现完整的 then

then 接收两个参数，一个是成功回调，一个是失败回调

then 可以被任何 promise 实例调用，所以它放在 promise 原型上

promise 不管成功和失败都会调用 then

返回一个新的 promise，状态不确定，取决于该 then 的返回值，可以进行链式调用

所以，then 根据 promise 状态调用不同回调

`then`本质是将 onFulfilled 的返回值包装成 promise 扔出去

onFulfilled 和 onRejected 的返回值计作 `x（promise a+ 规定）

x 的规则具体看 ⬇️ 代码

```js
class MyPromise {
  constructor(executor) {
    // ...
  }
  then(onFulfilled, onRejected) {
    // 首先判断两个参数
    // onFulfilled 如果不是函数则要包装成函数
    // onRejected 如果不会函数则要 throw
    onFulfilled =
      typeof onFulfilled === `function` ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === `function`
        ? onRejected
        : error => {
            throw error;
          };

    let promise2, _resolve, _reject; // 初始化 promise 和对应的 resolve,reject

    // Promise A+ test 要求有一个 resolvePromise 方法，包含以下规则
    // 0. 接收四个参数：promise，x，resolve，reject
    // 1. 禁止循环调用自身
    // 2. 如果是 promise 实例 => 等待 promise 状态变化拿到新值再去 resolve
    // 3. 如果是一个非null对象，且拥有 then 方法(thenable) 则要通过x.then(resolve)
    // 4. x是普通值，直接resolve(x)
    const resolvePromise = (promise, x, resolve, reject) => {
      // 1. 防止循环引用
      if (promise === x) {
        reject(new TypeError(`禁止循环引用`));
      }

      // 2. 如果 x 是 promise 实例
      if (x instanceof MyPromise) {
        if (x.status === PromiseStatus.Pending) {
          // 2.1 如果 x 的状态是pending
          // 2.1.1 将 x.then 的参数计作 y，y可能是普通值也可能是promise实例
          x.then(y => {
            resolvePromise(promise, y, resolve, reject);
          }, reject);
        } else {
          // 2.2 x 是已完成的状态
          x.then(resolve, reject);
        }
      } else {
        // 3. x 是个 thenable 对象
        if (typeof x === `function` || (typeof x === `object` && x !== null)) {
          // 3.1 是否执行过
          let called = false;
          try {
            const then = x.then;
            if (typeof then === `function`) {
              // 如果 then 是个函数，可以执行，那么就需要在 x 上执行之
              // then 的话记得成功的回调要resolvePromise，根上面2.x 是一样的
              // 并判断它有没有被执行过
              then.call(
                x,
                y => {
                  if (called) return;
                  called = true;
                  resolvePromise(promise, y, resolve, reject);
                },
                error => {
                  if (called) return;
                  called = true;
                  reject(error);
                }
              );
            } else {
              // then 不是一个函数，不能执行，则直接 resolve(x)
              resolve(x);
            }
          } catch (error) {
            // catch 也记得查看是否执行过
            if (called) return;
            called = true;
            reject(error);
          }
        } else {
          // x是个普通值
          resolve(x);
        }
      }
    };

    // 分别包装 onFulfilled 回调 和 onRejected 回调
    // 这里就要用到 promise2 的 resolve 和 reject，要通过promise2注册的时候闭包保存出来
    const onFulfilledCallback = value => {
      try {
        const x = onFulfilled(value);
        resolvePromise(promise2, x, _resole, _reject);
      } catch (error) {
        _reject(error);
      }
    };
    const onRejectedCallback = reason => {
      try {
        const x = onRejected(reason);
        resolvePromise(promise2, x, _resolve, _reject);
      } catch (error) {
        _reject(error);
      }
    };

    // 注册 promise2
    promise2 = new MyPromise((resolve, reject) => {
      // 保存resolve，reject，上面的 onFulfilledCallback 和 onRejectedCallback 要用到
      _resolve = resolve;
      _rejected = reject;

      // 通过 promise 的状态去判断怎么走流程
      if (this.status === PromiseStatus.Pending) {
        // pending 状态，把两个回调塞到回调队列
        // 在 resolve / reject 函数里进行一次setTimeout异步调用
        // 如果在这里setTimeout的话会产生很多轮宏任务 是不对的
        this.onFulfilledCallbacks.push(onFulfilledCallback);
        this.onRejectedCallbacks.push(onRejectedCallback);
      } else if (this.status === PromiseStatus.Fulfilled) {
        // fulfilled 状态
        // 需要异步调用
        setTimeout(() => {
          onFulfilledCallback(this.value);
        }, 0);
      } else {
        // rejected 状态
        // 同款异步调用
        setTimeout(() => {
          onRejectedCallback(this.reason);
        }, 0);
      }
    });

    // 最后一步不要忘记，then 返回的是新的 promise2
    return promise2;
  }
}
```

### 实现静态方法

```js
class MyPromise {
  // ...
  static resolve(value) {
    if (value instanceof MyPromise) {
      // 如果resolve的参数是一个 promise实例，直接返回
      return value;
    }
    // 否则包装成 promise 并调用 resolve
    return new MyPromise((resolve, reject) => {
      resolve(value);
    });
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}
```

## Promise A+ test

1. 首先新建一个 npm 工程，`yarn add promises-aplus-tests`

2. 修改`packag.json`

```json
{
  // ...
  "scripts": {
    "test": "promises-aplus-tests promise.js"
  }
  // ...
}
```

3. 将 deferred 静态方法加入

```js
class MyPromise {
  // ...
  static deferred() {
    let dfd = {};
    dfd.promise = new MyPromise((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  }
}
```

4. 命令行 `yarn test`，跑测试，直到完成

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210808202930.png)

完美通过所有测试用例

## Promise 完整代码

```js
const PromiseStatus = {
  Pending: `pending`,
  Fulfilled: `fulfilled`,
  Rejected: `rejected`,
};

class MyPromise {
  constructor(executor) {
    this.status = PromiseStatus.Pending;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      // 只有在 pending 状态才会执行
      // 调用 resolve 后，状态改为 fulfilled
      // 将 value 值赋给 this.value
      if (this.status === PromiseStatus.Pending) {
        setTimeout(() => {
          this.status = PromiseStatus.Fulfilled;
          this.value = value;
          this.onFulfilledCallbacks.forEach(fn => {
            fn(value);
          });
        });
      }
    };

    const reject = reason => {
      if (this.status === PromiseStatus.Pending) {
        setTimeout(() => {
          this.status = PromiseStatus.Rejected;
          this.reason = reason;
          this.onRejectedCallbacks.forEach(fn => {
            fn(reason);
          });
        });
      }
    };

    // 立即执行，并且如果用户输错要抛出错误，放在 try 里面
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // then 接收两个参数，一个是成功回调，一个是错误回调
  // then 可以在任何 promise 实例调用，所以放在 prototype 上
  // 使用哪一个回调取决于 promise 的状态，fulfilled走回调1，rejected走回调2
  // 如果还在 pending 则将两个回调都放入数组
  // then 返回一个新的 promise，可以链式调用
  then(onFulfilled, onRejected) {
    // 判断入参，回调1 不是函数 改成输入函数
    // 回调2 不是函数改成抛出错误
    onFulfilled =
      typeof onFulfilled === `function` ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === `function`
        ? onRejected
        : reason => {
            throw reason;
          };

    let promise2, _resolve, _reject; // 初始化 promise 和对应的 resolve,reject

    // Promise A+ test 要求有一个 resolvePromise 方法，包含以下规则
    // 0. 接收四个参数：promise，x，resolve，reject
    // 1. 禁止循环调用自身
    // 2. 如果是 promise 实例 => 等待 promise 状态变化拿到新值再去 resolve
    // 3. 如果是一个非null对象，且拥有 then 方法(thenable) 则要通过x.then(resolve)
    // 4. x是普通值，直接resolve(x)
    const resolvePromise = (promise, x, resolve, reject) => {
      // 1. 循环引用
      if (x === promise) {
        reject(new TypeError(`禁止循环引用`));
      }
      // 2. x是promise实例
      if (x instanceof MyPromise) {
        if (x.status === PromiseStatus.Pending) {
          // 2.1 如果 x 的状态是 pending
          // 2.1.1 等到promise fulfilled 或 rejected再执行
          // then 出来的 y 也有可能是 promise 实例，递归调用 resolvePromise
          // err => reject(err) 简写成 reject
          x.then(y => {
            resolvePromise(promise, y, resolve, reject);
          }, reject);
        } else {
          // 2.2 promise 已经被执行过（不是pending
          x.then(resolve, reject);
        }
      } else {
        // 3. x 是 函数 或者是 非null对象
        if (typeof x === `function` || (x !== null && typeof x === `object`)) {
          // 3.1 是否已执行过的标志
          let called = false;
          try {
            const then = x.then;
            if (typeof then === `function`) {
              // 如果 then 是个函数，可以执行，那么就需要在 x 上执行之
              // then 的话记得成功的回调要resolvePromise，根上面2.x 是一样的
              // 并判断它有没有被执行过
              then.call(
                x,
                y => {
                  // 如果已经执行过则不再执行
                  if (called) return;
                  called = true;
                  resolvePromise(promise, y, resolve, reject);
                },
                error => {
                  if (called) return;
                  called = true;
                  reject(error);
                }
              );
            } else {
              // then 不是一个函数，不能执行，则直接 resolve(x)
              resolve(x);
            }
          } catch (error) {
            // catch 也记得查看是否执行过
            if (called) return;
            called = true;
            reject(error);
          }
        } else {
          // 4. x 是普通值，直接resolve
          resolve(x);
        }
      }
    };

    // 分别包装 onFulfilled 回调 和 onRejected 回调
    // 这里就要用到 promise2 的 resolve 和 reject，要通过promise2注册的时候闭包保存出来
    const onFulfilledCallback = value => {
      try {
        const x = onFulfilled(value);
        resolvePromise(promise2, x, _resolve, _reject);
      } catch (error) {
        _reject(error);
      }
    };
    const onRejectedCallback = reason => {
      try {
        const x = onRejected(reason);
        resolvePromise(promise2, x, _resolve, _reject);
      } catch (error) {
        _reject(error);
      }
    };

    // 注册promise2
    promise2 = new MyPromise((resolve, reject) => {
      // 保存resolve，reject，上面的 onFulfilledCallback 和 onRejectedCallback 要用到
      _resolve = resolve;
      _reject = reject;

      // 通过 promise 的状态去判断怎么走流程
      if (this.status === PromiseStatus.Pending) {
        // pending 状态，把两个回调塞到回调队列
        // 在 resolve / reject 函数里进行一次setTimeout异步调用
        // 如果在这里setTimeout的话会产生很多轮宏任务 是不对的
        this.onFulfilledCallbacks.push(onFulfilledCallback);
        this.onRejectedCallbacks.push(onRejectedCallback);
      } else if (this.status === PromiseStatus.Fulfilled) {
        // fulfilled 状态
        // 需要异步调用
        setTimeout(() => onFulfilledCallback(this.value));
      } else {
        // rejected 状态
        // 同款异步调用
        setTimeout(() => onRejectedCallback(this.reason));
      }
    });

    // 最后一步不要忘记，then 返回的是新的 promise2
    return promise2;
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      // 如果resolve的参数是一个 promise实例，直接返回
      return value;
    }
    // 否则包装成 promise 并调用 resolve
    return new MyPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

module.exports = MyPromise;
```

## Promise 全家桶手写实现

### Promise.resolve

```js
Promise.resolve = function (val) {
  return new Promise(resolve => {
    resolve(val);
  });
};
```

### Promise.reject

```js
Promise.reject = function (val) {
  return new Promise((resolve, reject) => {
    reject(val);
  });
};
```

### Promise.prototype.finally

无论成功和失败都会将值继续往下传递

回调不接受参数

```js
Promise.prototype.finally = function (onFinished) {
  return this.then(val => {
    return Promise.resolve(onFinished()).then(() => val);
  }).catch(err => {
    return Promise.resolve(onFinished()).then(() => {
      throw err;
    });
  });
};
```

### Promise.prototype.catch

使用 promise 的 then 方法将失败的回调传入即可

```js
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};
```

### Promise.all

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
        .then(data => {
          helper(i, data);
        })
        .catch(err => reject(err));
    }
  });
};
```

### Promise.race

其中一个 resolve/reject 即可

```js
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      promise.then(resolve, reject);
    }
  });
};
```

### Promise.any

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

### Promise.allSettled

```js
Promise.allSettled = function (promises) {
  return new Promise((resolve, reject) => {
    let index = 0;
    let finishedCount = 0;
    const result = [];

    const wrapFulfilled = i => {
      return val => {
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

    const wrapRejected = i => {
      return err => {
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
