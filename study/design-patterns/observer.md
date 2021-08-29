# 观察者模式

`Observer` 一对多，多个观察者对象监听同一个实例，这个实例变化的时候会通知所有观察它的观察者对象

相比于发布/订阅，观察者模式是耦合起来的，没有调度中心

Vue2 响应式原理就是基于`Object.defineProperty`实现

```js
const targetObj = {
  name: `11`,
};
const targetObj2 = {
  name: `2`,
};

Object.defineProperty(targetObj, `name`, {
  enumerable: true,
  configurable: true,
  get: function () {
    return name;
  },
  set: function (val) {
    const oldVal = name;
    name = val;
    console.log(name, oldVal);
  },
});
targetObj.name = `abc`;
console.log(targetObj);
console.log(targetObj2);
```
