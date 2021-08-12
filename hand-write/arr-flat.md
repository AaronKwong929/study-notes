# 拍平数组

使用 `reduce` 和 递归

```js
const flat = (arr) =>
    arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? flat(cur) : cur));

const arr = [[1, [2]], 3, [4, [5, [6]]]];
console.log(flat(arr));
```

传入参数控制层数

一样的，加个参数判断即可，每次递归参数 -1

```js
// 控制拍平层数
const flat2 = (arr, num = 1) => {
    return num > 0
        ? arr.reduce(
              (pre, cur) =>
                  pre.concat(Array.isArray(cur) ? flat2(cur, num - 1) : cur),
              []
          )
        : arr.slice();
};
console.log(flat2(arr, 2));
```
