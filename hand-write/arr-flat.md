# 拍平数组

1. 拍平无限层级

```js
const flatten = arr =>
  arr.reduce(
    (pre, cur) => pre.concat(Array.isArray(cur) ? flat(cur) : cur),
    []
  );

const arr = [[1, [2]], 3, [4, [5, [6]]]];
console.log(flatten(arr));
```

2. 传入参数控制层数（剩余层数不拼接）

先判断 level

大于 0：进行 reduce 拼接

小于等于 0：不作操作，直接返回 slice

```js
const flatten = (arr, level = +Infinity) =>
  level > 0
    ? arr.reduce(
        (pre, cur) =>
          pre.concat(Array.isArray(cur) ? flatten(cur, level - 1) : cur),
        []
      )
    : arr.slice();

const arr = [[1, [2]], 3, [4, [5, [6]]]];
console.log(flatten(arr, 1));
```

3. 传入参数控制层数（超过参数抛弃）

判断 当前 level 是否大于 0

大于 0：判断数组还是数字，递归拼接

小于等于 0：抛弃 直接 `return acc;`

```js
const flatten = (list, level = +Infinity) =>
  list.reduce((acc, cur) => {
    if (level > 0)
      acc = acc.concat(Array.isArray(cur) ? flatten(cur, level - 1) : cur);
    return acc;
  }, []);

const arr = [[1, [2]], 3, [4, [5, [6]]]];
console.log(flatten(arr, 2));
```
