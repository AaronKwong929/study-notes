# 实现 new

new 的函数如果有返回值而且返回值是对象，要返回对象

```js
function Otaku(name, age) {
  this.name = name;
  this.age = age;
  return {
    name: name,
    habit: 'Games',
  };
}
var person = new Otaku('Kevin', '18');
console.log(person.name); // Kevin
console.log(person.habit); // Games
console.log(person.strength); // undefined
console.log(person.age); // undefined
```

```js
const fn = function () {
  const obj = {};
  const ctor = Array.prototype.shift.call(arguments);
  obj.__proto__ = ctor.prototype; // 实例proto改成构造函数prototype
  const res = ctor.apply(obj, arguments); // 用obj去执行
  // 如果是是对象则直接返回对象 否则返回obj
  return typeof res === `object` ? res : obj;
};

// 测试
var p = fn(Otaku, `kevin`, 18);
console.log(p);
```
