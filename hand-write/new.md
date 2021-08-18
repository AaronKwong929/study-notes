# 实现 new

创建一个对象`obj`，修改 `obj` 的原型，用构造函数 `call/apply` 参数

判断参数是对象返回对象，否则返回`obj`

```js
function New(ctor, ...args) {
  const obj = {};
  obj.__proto__ = ctor.prototype;
  const res = ctor.apply(obj, args);
  return typeof res === `object` ? res : obj;
}

// 测试
var p = New(Otaku, `kevin`, 18);
console.log(p);
```

可以加入`ctor`类型判断

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
