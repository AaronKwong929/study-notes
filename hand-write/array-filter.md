# 实现 Array.prototype.filter()

返回一个新数组，对原元素传入回调执行过滤

```js
Array.prototype.myFilter = function (fn) {
  const res = [];
  for (let i = 0; i < this.length; i++) {
    if (fn(this[i], i)) res.push(this[i]);
  }
  return res;
};

const arr = [1, 2, 3];
console.log(arr.myFilter(item => item > 3));
```
