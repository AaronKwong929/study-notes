# 模拟远程加法

> 来自 https://juejin.cn/post/6987529814324281380

```js
// 假设本地机器无法做加减乘除运算，需要通过远程请求让服务端来实现。
// 以加法为例，现有远程API的模拟实现

const addRemote = async (a, b) =>
  new Promise(resolve => {
    setTimeout(() => resolve(a + b), 1000);
  });

// 请实现本地的add方法，调用addRemote，能最优的实现输入数字的加法。
async function add(...inputs) {
  // 你的实现
}

// 请用示例验证运行结果:
add(1, 2).then(result => {
  console.log(result); // 3
});

add(3, 5, 2).then(result => {
  console.log(result); // 10
});
```

采用 reduce 连加，和 cache 来进行缓存提速

```js
const cache = {};
const addRemote = async (a, b) =>
  new Promise(resolve => {
    setTimeout(() => resolve(a + b), 1000);
  });

// 请实现本地的add方法，调用addRemote，能最优的实现输入数字的加法。
async function add(...inputs) {
  return inputs.reduce(
    (pre, cur) => pre.then(res => addFn(res, cur)),
    Promise.resolve(0)
  );
}

// 加缓存，如果命中缓存就直接返回
async function addFn(a, b) {
  const key1 = `${a},${b}}`,
    key2 = `${b},${a}`;
  const cacheVal = cache[key1] || cache[key2];
  if (cacheVal) return Promise.resolve(cacheVal); // 注意这里要resolve

  // reduce 要连加 pre.then 用到，要加入缓存并 return
  return addRemote(a, b).then(res => {
    cache[key1] = res;
    cache[key2] = res;
    return res;
  });
}
```
