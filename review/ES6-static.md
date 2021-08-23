# ES6 的 static 相关

> 先来 MDN [Class - static](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/static)，类（class）通过 static 关键字定义静态方法。**不能**在类的实例上调用静态方法，而应该通过类本身调用。

`静态属性`和`静态方法`，挂在构造函数的 constructor 上

```js
class A {
  constructor() {}
  static getName() {
    console.log(`aaa`);
  }
}
class B extends A {
  constructor() {}
}
B.getName(); // aaa
const b = new B();
console.log(b);
b.getName(); // TypeError: b.getName is not a function
```

## 总结

静态属性/静态方法属于类本身的功能，和实例没有关系，都可以被继承

类似于`Vue源码 - 响应式原理` `Dep.target = target;` 将 target 直接挂到 Dep 上，与实例没有关系
