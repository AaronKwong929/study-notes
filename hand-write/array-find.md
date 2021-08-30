# 实现 Array.prototype.find()

返回目标，没有命中则返回`undefined`

find 参数：callbackFn；thisArg callbackFn 里的 this 指向

callbackFn 参数 `element` 当前元素；`index` 当前下标；`array` 目标数组

```js
Array.prototype.myFind = function (fn) {
  for (let i = 0; i < this.length; i++) {
    if (fn(this[i], i)) return this[i];
  }
};

const arr = [{ id: 1 }, { id: 2 }];
console.log(arr.myFind(item => item.id === 1));
```
