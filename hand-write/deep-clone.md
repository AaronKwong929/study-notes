# 实现深克隆

## 递归方案和细节

```js
const isObject = source =>
  source !== null &&
  (typeof source === `function` || typeof source === `function`);

const deepClone = source => {
  // 如果是对象则进行递归调用
  if (typeof source === `object`) {
    const res = Array.isArray(source) ? [] : {};
    for (const key in source) {
      res[key] = deepClone(source[key]);
    }
    return res;
  } else {
    // 否则直接返回(基础类型)
    return target;
  }
};
```

要解决递归嵌套死循环的问题

```js
const source = {
  //...
};
source.source = source;
```

传入一个 map，记录所有已克隆过的内容，如果命中则直接返回

```js
const deepClone = (source, map = new Map()) => {
  // 基本类型 直接返回
  if (!isObject(source)) return source;
  else {
    // 如果是对象则进行递归调用
    const res = Array.isArray(source) ? [] : {};
    // 命中缓存直接返回
    if (map.has(source)) return map.get(source);
    // 设置缓存
    map.set(source, res);
    for (const key in source) {
      res[key] = deepClone(source[key], map);
    }
    return res;
  }
};
```

> 下面可以考虑性能优化

`while` `for` `for in`，效率递减

使用 while 做一个迭代器

```js
// while 迭代器 - 性能优化
const forEach = (list, iterator) => {
  let index = -1;
  while (++index < list.length) {
    iterator(list[index]);
  }
};
```

然后将原本的`for in`改下

```js
const keys = Object.keys(source);
forEach(keys, item => {
  console.log(`item`, item);
  res[item] = deepClone(source[item], map);
});
```

## 完整代码

```js
// 判断是不是对象
const isObject = source => {
  const type = typeof source;
  return (source !== null && type === `object`) || type === `function`;
};

// while 迭代器 - 性能优化
const forEach = (list, iterator) => {
  let index = -1;
  while (++index < list.length) iterator(list[index]);
};

const deepClone = (source, map = new Map()) => {
  // 基本类型 直接返回
  if (!isObject(source)) return source;
  else {
    // 否则进行递归调用
    const res = Array.isArray(source) ? [] : {};
    // 命中缓存直接返回
    if (map.get(source)) return map.get(source);
    // 设置缓存
    map.set(source, res);
    const keys = Object.keys(source);
    forEach(keys, item => {
      res[item] = deepClone(source[item], map);
    });
    return res;
  }
};
```
