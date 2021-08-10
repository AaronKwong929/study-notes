# 实现一个函数 groupBy

> https://github.com/shfshanyue/Daily-Question/issues/698

类似 lodash.groupBy

```js
groupBy(
  [
    { id: 1, name: '山月', sex: 'male' },
    { id: 2, name: '张三', sex: 'female' },
    { id: 3, name: '李四', sex: 'female' },
  ],
  x => x.sex
);
```

参数 1：list(Array<any>)
参数 2：分组依据(fn)

1. reduce

指定累加初始值为空对象

```js
function groupBy(collection, by) {
  return collection.reduce((acc, cur) => {
    if (!acc[by(cur)]) {
      acc[by(cur)] = [];
    }
    acc[by(cur)].push(cur);
    return acc;
  }, {});
}
```

2. 简单一点的

```js
function groupBy(collection, by) {
  const map = {};
  collection.forEach(item => {
    if (!map[by(item)]) map[by(item)] = [];
    map[by(item)].push(item);
  });
  return map;
}
```

## 测试

```js
function groupBy(collection, by) {
  return collection.reduce((acc, cur) => {
    if (!acc[by(cur)]) {
      acc[by(cur)] = [];
    }
    acc[by(cur)].push(cur);
    return acc;
  }, {});
}

console.log(
  groupBy(
    [
      { id: 1, name: '山月', sex: 'male' },
      { id: 2, name: '张三', sex: 'female' },
      { id: 3, name: '李四', sex: 'female' },
    ],
    x => x.sex
  )
);
```

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210810102947.png)
