const PromiseStatus = {
  Pending: 'PENDING',
  FulFilled: 'FULFILLED',
  Rejected: 'REJECTED',
};

class MyPromise {
  constructor(excutor) {
    this.status = PromiseStatus.Pending;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    this.value = undefined;
    this.reason = undefined;

    // 当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
    const resolve = value => {
      // promise 的状态只能更改一次
      if (this.status === PromiseStatus.Pending) {
        setTimeout(() => {
          this.status = PromiseStatus.FulFilled;
          this.value = value;
          this.onFulfilledCallbacks.forEach(callback => {
            callback(value);
          });
        });
      }
    };

    // 当 promise 被拒绝执行时，所有的 onRejected 需按照其注册顺序依次回调
    const reject = reason => {
      // promise 的状态只能更改一次
      if (this.status === PromiseStatus.Pending) {
        setTimeout(() => {
          this.status = PromiseStatus.Rejected;
          this.reason = reason;
          this.onRejectedCallbacks.forEach(callback => {
            callback(reason);
          });
        });
      }
    };

    try {
      excutor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : reason => {
            throw reason;
          };

    let promise2;
    let _resolve;
    let _reject;

    const resolvePromise = (promise, x, resolve, reject) => {
      // 禁止循环调用
      if (promise === x) {
        reject(new TypeError('禁止循环调用'));
      }

      // 如果 x 是 Promise 实例
      if (x instanceof MyPromise) {
        // 如果 x 的状态为 Pending，那么直到 x 为 Fulfilled 或 Rejected 才调用 resolve
        if (x.status === PromiseStatus.Pending) {
          console.log(`aa啊a `, x);
          x.then(
            y => {
              console.log(`yy`, y);
              // 进一步 resolvePromise 是因为 y 也有可能是个 Promise 实例 / thenable 对象
              resolvePromise(promise, y, resolve, reject);
            },
            r => {
              reject(r);
            }
          );
        } else {
          x.then(resolve, reject);
        }
      } else {
        // x 不是 Promise 实例

        // x 是函数或对象
        if (typeof x === 'function' || (x !== null && typeof x === 'object')) {
          let called = false;
          try {
            const then = x.then;
            // 确保只执行一次
            if (typeof then === 'function') {
              then.call(
                x,
                y => {
                  if (called) {
                    return;
                  }
                  called = true;
                  resolvePromise(promise, y, resolve, reject);
                },
                r => {
                  if (called) {
                    return;
                  }
                  called = true;
                  reject(r);
                }
              );
            } else {
              resolve(x);
            }
          } catch (error) {
            if (called) {
              return;
            }
            called = true;
            reject(error);
          }
        } else {
          resolve(x);
        }
      }
    };

    const onFulfilledCallback = value => {
      try {
        const x = onFulfilled(value);
        resolvePromise(promise2, x, _resolve, _reject);
      } catch (error) {
        _reject(error);
      }
    };

    const onRejectedCallback = value => {
      try {
        const x = onRejected(value);
        resolvePromise(promise2, x, _resolve, _reject);
      } catch (error) {
        _reject(error);
      }
    };

    promise2 = new MyPromise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;

      if (this.status === PromiseStatus.Pending) {
        this.onFulfilledCallbacks.push(onFulfilledCallback);
        this.onRejectedCallbacks.push(onRejectedCallback);
      }

      if (this.status === PromiseStatus.FulFilled) {
        setTimeout(() => onFulfilledCallback(this.value));
      }

      if (this.status === PromiseStatus.Rejected) {
        setTimeout(() => onRejectedCallback(this.reason));
      }
    });

    return promise2;
  }

  // resolve 静态方法
  static resolve(parameter) {
    // 如果传入 MyPromise 就直接返回
    if (parameter instanceof MyPromise) {
      return parameter;
    }

    // 转成常规方式
    return new MyPromise(resolve => {
      resolve(parameter);
    });
  }

  // reject 静态方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

MyPromise.resolve()
  .then(() => {
    console.log(0);
    return MyPromise.resolve(4);
    // return 4;
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
