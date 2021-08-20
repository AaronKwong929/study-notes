# 实现 instanceOf

> instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。(MDN: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)

根据 MDN 描述，检测一个`构造函数`的 prototype 属性,是否在`实例`的原型链上

构造函数的 `prototype` === 实例的 `__proto__`属性

1. instance 必须是对象 / 函数，传个字符串之类的直接给 false

2. 循环判断左边的原型链上是否有右边的 prototype

```js
function myInstanceof(instance, parent) {
  if (typeof instance !== `object` && typeof instance !== `function`)
    return false;
  let proto = instance.__proto__ || null;
  while (proto) {
    if (proto === null) return false;
    if (proto === parent.prototype) return true;
    proto = proto.__proto__;
  }
  return false;
}
```
