# 如何尽量避免内存泄漏

1. 避免使用全局变量

```js
// a = 1
var a = 1;
window.a; // 1
```

```js
function a() {
    this.a = 1;
}
a();
// this指向window,
window.a // 1
```

2. 减少使用闭包 （闭包存在于内存中

3. 清除计时器 clearInterval

4. 解除dom引用

在vue中 beforeUnmount 