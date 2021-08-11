# 学习 vue3 的一些工具函数

## extend 合并

```js
const extend = Object.assign;
```

减少代码量，对应到日常开发时可以使用这个函数来将接口返回的内容 和 前后端商定好的接口格式默认值进行兜底处理，避免了由于后端少给/给错值导致前端页面崩溃的情况

拓展：可以加入类型传入判断和值判断，如果不满足预定类型则不进行合并，修改接口结果为兜底默认值

## hasOwn 拥有属性

```js
const hasOwnProperty = Object.prototype.hasOwnProperty;

const hasOwn = (source, key) => hasOwnProperty.call(source, key);
```

判断对象里是否有目标键

从 Object.prototype 取得方法，避免了原型复写的情况，再通过`call`改变 this 指向 source 去调用，和下面说的获取准确类型异曲同工

## isArray 判断数组

`const isArray = Array.isArray;`

在工作中可以整合到判断类型

```js
export const getDataType = val =>
  Object.prototype.toString.call(val).slice(8, -1);

export const isInt = val => /^[0-9]*$/.test(val);
export const isFloat = val => isNumber(val) && ~~val !== val;

export const isNumber = val => getDataType(val) === 'Number';
export const isString = val => getDataType(val) === 'String';
export const isBoolean = val => getDataType(val) === 'Boolean';
export const isUndefined = val => getDataType(val) === 'Undefined';
export const isNull = val => getDataType(val) === 'Null';
export const isObject = val => getDataType(val) === 'Object';
export const isFunction = val => getDataType(val) === 'Function';
export const isDate = val => getDataType(val) === 'Date';
export const isArray = val => getDataType(val) === 'Array';
export const isRegExp = val => getDataType(val) === 'RegExp';
export const isSet = val => getDataType(val) === 'Set';
```

## hasChanged 判断是否有变化

```js
const hasChanged = (value, oldValue) =>
  value !== oldValue && (value === value || oldValue === oldValue);
```

可以用于监听某些值是否变化

## invokeArrayFns

统一参数执行一系列的函数

```js
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
```

`for`其实实现起来会比`while`慢一点

手写题性能优化的时候可以考虑下用 while 来写，下面例子

```js
const invokeArrayFns = (fns, arg) => {
  let i = -1;
  while (++i < list.length) {
    fns[i](arg);
  }
};
```

另外写一个 while 的数组迭代器

```js
const forEach = (list, iterator) => {
  let index = -1;
  while (++index < list.length) {
    iterator(list[index], index);
  }
};
```

## getGlobalThis 获取全局对象

```js
let _globalThis;
const getGlobalThis = () => {
  return (
    _globalThis ||
    (_globalThis =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : {})
  );
};
```

首次调用，\_globalThis 必然是 undefined，接着往下走

存在 globalThis 则直接返回

self ==> worker 线程中不能访问到 window 对象，但是可以通过 self 访问到 `worker 环境`里的全局对象

window ===> 浏览器环境

global ===> Node 环境下

都不存在的话返回空对象 ==> 可能是微信小程序

`_globalThis`闭包保存执行结果，多次调用只需要执行一次，也是`提升性能`的一点
