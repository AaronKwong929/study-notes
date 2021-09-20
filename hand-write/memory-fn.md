# 记忆函数

> 实现一个 once 函数，记忆返回结果只执行一次

```js
function once(fn) {
  let result, revoked;
  return (...args) => {
    if (revoked) return result;
    revoked = true;
    result = fn.apply(this, args);
    return result;
  };
}
const f = () => {
  console.log(`call`);
  return 3;
};
once_f = once(f);
once_f();

once_f();
```

这个其实和 vue 的工具函数有点像

```js
const cacheStringFunction = fn => {
  const cache = Object.create(null);
  return str => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
```
