# 实现 Array.prototype.findIndex()

返回下标，没有命中则返回`undefined`

findIndex 参数：callbackFn；thisArg callbackFn 里的 this 指向

callbackFn 参数 `element` 当前元素；`index` 当前下标；`array` 目标数组

```js
Array.prototype.myFindIndex = function (fn) {
  for (let i = 0; i < this.length; i++) {
    if (fn(this[i], i)) return i;
  }
  return -1;
};

const arr = [{ id: 1 }, { id: 2 }];
arr.myFindIndex(item => item.id === 1);
```
