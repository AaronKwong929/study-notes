# this

## 隐式绑定

> this 永远指向最后调用它的那个对象

```js
function foo() {
  console.log(this.a);
}
var obj = { a: 1, foo };
var a = 2;
obj.foo();
```

这里输出 1，虽然`foo`定义在 window 下，但是最后调用它的是`obj.foo` ==> `window.obj.foo()`

指向最后调用它的`obj`，所以输出 1

## 隐式绑定发生隐式丢失的问题

1. 使用另一个变量存放函数会发生隐式丢失 ==> **绑定到最后一个调用它的对象**

```js
function foo() {
  console.log(this.a);
}
var obj = { a: 1, foo };
var a = 2;
var foo2 = obj.foo;

obj.foo();
foo2();
```

输出：1，2

虽然 foo2 是 obj.foo 的别名 但是调用 foo2 的是 window

```js
function foo() {
  console.log(this.a);
}
var obj = { a: 1, foo };
var a = 2;
var foo2 = obj.foo;
var obj2 = { a: 3, foo2: obj.foo };

obj.foo();
foo2();
obj2.foo2();
```

输出 1，2，3

`obj.foo`隐式绑定 obj 输出 1；foo2 取别名 隐式丢失，指向 window 输出 2；`obj2.foo2`隐式丢失 指向最后调用的 obj2，输出 3

2. `函数当成参数传递也会发生隐式丢失` ==> **绑定到 window 上**

```js
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
  console.log(this);
  fn();
}
var obj = { a: 1, foo };
var a = 2;
doFoo(obj.foo);
```

window, 2

dooFoo 本身就是 window 在调用，this 指向 window 是正确的

传递过程中 obj.foo 隐式绑定丢失，指向 window

```js
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
  console.log(this);
  fn();
}
var obj = { a: 1, foo };
var a = 2;
var obj2 = { a: 3, doFoo };

obj2.doFoo(obj.foo);
```

{a:3,foo}, 2
`把一个函数当成参数传递到另一个函数，会发生隐式丢失的问题` ==> setTimeout 中传入的回调（作为参数传递）所以 this 丢失指向 window

且与包裹着它的函数的 this 指向无关。

在非严格模式下，会把该函数的 this 绑定到 window 上，严格模式下绑定到 undefined。

## 显式绑定

```js
var obj = {
  a: 1,
  foo: function (b) {
    b = b || this.a;
    return function (c) {
      console.log(this.a + b + c);
    };
  },
};
var a = 2;
var obj2 = { a: 3 };

obj.foo(a).call(obj2, 1);
obj.foo.call(obj2)(1);
```

6,6

第一行：`obj.foo(2).call(obj2, 1)` b = 2,c = 1, 显式绑定 obj2 this.a = 3 `3 + 2 + 1 = 6`

第二行：将 obj2 显式绑定到 obj.foo 上，并且没有传值，所以 b = this.a = 3 , c = 1, 返回出来的函数调用是 window，this.a = 2 `2 + 3 + 1 = 6`

## 总结显式绑定和隐式绑定

this 永远指向最后调用它的那个对象

匿名函数的 this 永远指向 window

使用.call()或者.apply()的函数是会直接执行的

bind()是创建一个新的函数，需要手动调用才会执行

如果 call、apply、bind 接收到的第一个参数是空或者 null、undefined 的话，则会忽略这个参数

forEach、map、filter 函数的第二个参数也是能显式绑定 this 的

## 箭头函数绑定

箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 undefined。

对象没有作用域。

作用域只有`全局作用域 window` 和 `局部作用域函数`

```js
var obj = {
  name: 'obj',
  foo1: () => {
    console.log(this.name);
  },
  foo2: function () {
    console.log(this.name);
    return () => {
      console.log(this.name);
    };
  },
};
var name = 'window';
obj.foo1();
obj.foo2()();
```

window, obj, obj

foo1 的外层作用域是 window（对象不是作用域） ==> 打印 window

obj.foo2() this 指向 obj，先打印 obj，箭头函数往作用域上找，foo2 的函数作用域，所以也打印 obj

## 四种绑定方式

1. 默认绑定

非严格模式下 this 指向 window，严格模式下 this 指向 undefined

```js
this.a = 2;
console.log(a); // 2
console.log(window.a); // 2
window.a === a; // true
```

2. 隐式绑定（其实就是指向调用它的位置

```js
function foo() {
  console.log(this.a);
}
var obj = {
  foo: foo,
  a: 2,
};
console.log(obj.foo()); // 2
```

### 下面这段会有迷惑性

```js
var obj = {
  a: 1,
  foo: function () {
    console.log(this.a);
  },
};

var baz = obj.foo;
baz(); // undefined
```

因为 baz 引用的是 obj.foo 这个函数，调用 baz 是在全局环境下，所以 this.a === window.a === undefined

3. 显式绑定，call，apply 等直接指定 this 的指向，关于 call apply 的区别看同目录另一篇

```js
function foo() {
  console.log(a);
}

var obj = {
  a: 2,
};
foo.call(obj);
```

4. new 绑定，this 指向 new 的对象

```js
function a() {
  this.a = 2;
}

var b = new a();
console.log(b.a); // 2
```

## 优先级

new > 显式 > 隐式 > 默认绑定
