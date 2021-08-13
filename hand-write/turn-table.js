const sleep = delay =>
  new Promise(resolve => setTimeout(() => resolve(delay), delay));

// const turnTablePromise = (requestFn, animationTime) =>
//   Promise.all([requestFn, sleep(animationTime)]);

// 模拟一个异步请求函数
function createRequest(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('done');
    }, delay);
  });
}

const turnTablePromise = (requestFn, animationTime) => {
  const promises = [requestFn, sleep(animationTime)];
  return new Promise((resolve, reject) => {
    const result = [];
    const helper = (i, data) => {
      result[i] = data;
      if (++i === promises.length) {
        resolve(result);
      }
    };

    for (let i = 0; i < promises.length; i++) {
      promises[i].then(res => helper(i, res), reject);
    }
  });
};

// 请求比转盘动画快
turnTablePromise(createRequest(2000), 5000).then(res => console.log(res));

// 请求比转盘动画慢
turnTablePromise(createRequest(2000), 1000).then(res => console.error(res));
