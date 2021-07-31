const PENDING = `pending`;
const FULFILLED = `fulfilled`;
const REJECTED = `rejected`;

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  status = PENDING; // 初始状态

  value = null; // resolve值

  reason = null; // reject值

  resolve = value => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      while (this.onFulfilledCallbackList.length)
        this.onFulfilledCallbackList.shift()(value); // 如果有callback（之前没完成存起的），顺次执行
    }
  };

  reject = reason => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      while (this.onRejectedCallbackList.length)
        this.onRejectedCallbackList.shift()(reason); // 同上
    }
  };

  onFulfilledCallbackList = [];
  onRejectedCallbackList = [];

  then(onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve2, reject2) => {
      if (this.status === FULFILLED) {
        queueMicrotask(() => {
          const x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve2, reject2);
        });
      } else if (this.status === REJECTED) {
        onRejected(this.reason);
      } else {
        // pending 状态将回调存入数组
        this.onFulfilledCallbackList.push(onFulfilled);
        this.onRejectedCallbackList.push(onRejected);
      }
    });
    return promise2;
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) return reject(new TypeError(`same promise`));
  if (x instanceof MyPromise) {
    // 如果是MyPromise的实例对象，执行then 将状态变成FULFILLED或者REJECTED
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
}

module.exports = MyPromise;
const promise = new MyPromise((resolve, reject) => {
  resolve('success');
});

// 这个时候将promise定义一个p1，然后返回的时候返回p1这个promise
const p1 = promise.then(value => {
  console.log(1);
  console.log('resolve', value);
  return p1;
});

// 运行的时候会走reject
p1.then(
  value => {
    console.log(2);
    console.log('resolve', value);
  },
  reason => {
    console.log(3);
    console.log(reason.message);
  }
);
