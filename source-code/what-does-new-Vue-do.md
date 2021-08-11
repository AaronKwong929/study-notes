# new Vue 做了什么？

首先检测是否实例是从 `new Vue` 整出来的，保证无法通过`Vue()`去调用

```js
function Vue(options) {
  if (!(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}
```

如果不是则控制台警告，如果是则进行下一步，`_init`方法

然后则是

```js
// 定义Vue原型上的init方法(内部方法)
initMixin(Vue);

// 定义原型上跟数据相关的属性方法
stateMixin(Vue);

//定义原型上跟事件相关的属性方法
eventsMixin(Vue);

// 定义原型上跟生命周期相关的方法
lifecycleMixin(Vue);

// 定义渲染相关的函数
renderMixin(Vue);
```
