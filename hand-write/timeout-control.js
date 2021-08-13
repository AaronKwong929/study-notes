// // Promise.race + 睡眠函数

//  睡眠函数到点 reject
const sleep = timeout =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      reject(`timeout`);
    }, timeout)
  );

// // 将 promise 包装成一个带超时控制的
// const timeoutPromise = (requestFn, timeout) =>
//   Promise.race([requestFn, sleep(timeout)]);

// 测试
// 模拟一个异步请求函数
function createRequest(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('done');
    }, delay);
  });
}

// // 超时的例子
// timeoutPromise(createRequest(2000), 1000).catch(error => console.error(error));
// // 不超时的例子
// timeoutPromise(createRequest(2000), 3000).then(res => console.log(res));

const timeoutPromise2 = (requestFn, timeout) => {
  const promises = [requestFn, sleep(timeout)];
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      promise.then(resolve, reject);
    }
  });
};

// 超时的例子
timeoutPromise2(createRequest(2000), 1000).catch(error => console.error(error));
// 不超时的例子
timeoutPromise2(createRequest(2000), 3000).then(res => console.log(res));
