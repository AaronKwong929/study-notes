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

MyPromise.resolve()
  .then(() => {
    console.log(0);
    return MyPromise.resolve(4);
  })
  .then(res => {
    console.log(res);
  });

MyPromise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });
