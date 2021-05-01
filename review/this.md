# this

this 指向调用它的位置(单层)

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

4. new 绑定

```js
function a() {
  this.a = 2;
}

var b = new a();
console.log(b.a); // 2
```

## 优先级

new > 显式 > 隐式 > 默认绑定
