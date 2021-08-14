// 使用promise实现隔秒输出 1 2 3
const arr = [1, 2, 3];
arr.reduce(
  (pre, cur) =>
    pre.then(
      () =>
        new Promise(r =>
          setTimeout(() => {
            console.log(cur);
            r();
          }, 1000)
        )
    ),
  Promise.resolve()
);
