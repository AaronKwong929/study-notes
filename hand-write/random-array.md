# 打乱数组

```js
function shuffle(list) {
  return list.sort((a, b) => (Math.random() > 0.5 ? 1 : -1));
}
```

取随机下标

从后往前取，可以取到 `[0, arr.length)` floor 之后最大值变成数组最右指针

如果有重复取指针的情况，可以用 map 来记录

```js
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
```
