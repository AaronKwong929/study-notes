# new

1. new 能访问到构造函数的属性

2. new 能访问到构造函数原型上的属性

## 如果函数返回值是基础类型值

```js

```


## 如果函数有返回值且是对象

```js
function Otaku(name, age) {
  this.strength = 60;
  this.age = age;

  return {
    name: name,
    habit: "Games",
  };
}
var person = new Otaku("Kevin", "18");
console.log(person.name); // Kevin
console.log(person.habit); // Games
console.log(person.strength); // undefined
console.log(person.age); // undefined
```

## 手写实现一个 new

```js
var objectFactory = function () {
  var obj = new Object();
  var Constructor = Array.prototype.shift.call(arguments);
  obj.__proto__ = Constructor.prototype;

  var ret = Constructor.apply(obj, arguments);
  // 如果是个对象就返回对象，如果不是就直接返回 obj
  return typeof ret === "object" ? ret : obj;
};
```
