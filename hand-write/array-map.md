# 实现 Array.prototype.map()

返回一个数组，每个内容基于原来的数组内容进行传入的回调调用

```js
Array.prototype.myMap = function (fn) {
  if (typeof fn !== `function`) throw new TypeError(``);
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result[i] = fn(this[i]);
  }
  return result;
};

const arr = [1, 2, 3];
console.log(arr.map(x => x * 2));
```
