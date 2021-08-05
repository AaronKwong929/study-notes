# 如何实现 console.log(a==1 && a==2 && a==3)

直接上答案，和 defineProperty 相关

a 是个对象，改下 getter

```js
var value = 0;
Object.defineProperty(window, 'a', {
  get: function () {
    return ++this.value;
  },
});
console.log(a == 1 && a == 2 && a == 3);
```
