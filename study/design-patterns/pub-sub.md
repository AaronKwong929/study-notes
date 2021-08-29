# 发布订阅模式

`Publisher/Subscriber`

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210829152031.png)

区别于 `Observer`，拥有一个调度中心，区别于`观察者模式`，发布订阅模式将发布者和订阅者解耦，发布者只管通知，不管有谁，有多少响应；订阅者只管响应，不管有谁在发布通知

## Vue EventBus 的实现

除开`new Vue`开一个新的 vue 实例作`EventBus`，我们也可以手写一个来实现对应功能

手写版本具体看[这里](/practices/encapsulating-event-bus.md)

```js
export default class EventBus {
  constructor() {
    this.event = Object.create(null);
  }
  // 注册事件
  $on(name, fn) {
    if (!this.event[name]) {
      // 一个事件可能有多个监听者
      this.event[name] = [];
    }
    this.event[name].push(fn);
  }
  // 触发事件
  $emit(name, ...args) {
    //给回调函数传参
    this.event[name] &&
      this.event[name].forEach(fn => {
        fn(...args);
      });
  }
  // 只被触发一次的事件，触发后删除事件
  $once(name, fn) {
    const cb = (...args) => {
      fn(...args);
      this.off(name, fn);
    };
    this.$on(name, cb);
  }
  // 取消事件
  $off(name, offCb) {
    // 没有制定参数，清除全部
    if (!name && !offCb) {
      this.event = Object.create(null);
      return;
    }
    if (this.event[name]) {
      const index = this.event[name].findIndex(fn => fn === offCb);
      this.event[name].splice(index, 1);
      if (!this.event[name].length) delete this.event[name];
    }
  }
}
```
