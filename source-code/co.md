# 学习 CO 源码

## CO 是什么

> co 函数库是著名程序员 TJ Holowaychuk 于 2013 年 6 月发布的一个小工具，用于 [Generator](<(https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator)>) 函数的自动执行。 -- [阮一峰](https://www.ruanyifeng.com/blog/2015/05/co.html)

基于 generator 和 promise，只需要传入 generator 就可以无限执行，而且返回的结果也是 promise，可以 then

下面三种都可以声明生成器（只不过格式化之后都会变成第一种）

```js
function* a() {}
function * a() {}
function *a() {}
function*a() {}
```

## 源码的工具函数

### 检查是不是一个对象

```js
/**
 * Check for plain object.
 *
 * @param {Mixed} val
 * @return {Boolean}
 * @api private
 */
function isObject(val) {
  return Object == val.constructor;
}
```

这里和原型链有关

```js
const obj = {};
obj.constructor === Object; // true
// 其实是在原型链上找到了 constructor 属性
obj.__proto__.constructor === Object; // true 是这个的简写
```

### 检查是不是`generator`

generator 有`next`,`return`,`throw`方法

```js
/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}
```

为什么只检查 `next` 和 `throw`?

```js
function* a() {
  yield 1;
  yield 2;
}
const aa = a();
typeof aa.next === `function`; // true
typeof aa.return === `function`; // true
typeof aa.throw === `function`; // true
```

### 检查是不是 generator 的"构造函数"?

[MDN - function\*](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*)

```js
/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if (
    'GeneratorFunction' === constructor.name ||
    'GeneratorFunction' === constructor.displayName
  )
    return true;
  return isGenerator(constructor.prototype);
}
```

### 检查是不是 Promise 实例

这里只是直接判断传入参数的`then`是不是函数

```js
/**
 * Check if `obj` is a promise.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
function isPromise(obj) {
  return 'function' == typeof obj.then;
}
```

如果是一个`thenable`对象也可以通过这个校验

```js
const a = {
  then() {
    return;
  },
};
isPromise(a); // true
```

所以其实可以改一下这里，参考上面的检查`function*`

```js
function isPromise(obj) {
  return obj.constructor.name === `Promise`;
}
```

## CO 本身

```js
/**
 *
 * @param {Function} fn
 * @return {Promise}
 * @api public
 */
function co(gen) {
  var ctx = this;
  var args = slice.call(arguments, 1);
  return new Promise(function (resolve, reject) {
    if (typeof gen === 'function') gen = gen.apply(ctx, args);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);
    onFulfilled(); // 启动执行
    /**
     * @param {Mixed} res
     * @return {Promise}
     * @api private
     */
    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }
    /**
     * @param {Error} err
     * @return {Promise}
     * @api private
     */
    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }
    /**
     *
     * @param {Object} ret
     * @return {Promise}
     * @api private
     */
    function next(ret) {
      // 如果 Generator 执行完，直接返回
      if (ret.done) return resolve(ret.value);
      // 将 ret.value promisify
      var value = toPromise.call(ctx, ret.value);
      // 如果 value 有值并且它是个 promise，可以继续执行 generator.next
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(
        new TypeError(
          'You may only yield a function, promise, generator, array, or object, ' +
            'but the following object was passed: "' +
            String(ret.value) +
            '"'
        )
      );
    }
  });
}
```

## 总结

感觉检查 Promise 那块可以优化一下下...

传入一个 generator，剩下的全部全自动执行

看 CO 可以增强对 generator 的理解，可以用在`Node`环境下对大文件 stream 读取

```js
const co = require('co');
const fs = require('fs');
const stream = fs.createReadStream('./some-large-file.txt');
co(function* () {
  while (true) {
    const res = yield Promise.race([
      new Promise(resolve => stream.once('data', resolve)),
      new Promise(resolve => stream.once('end', resolve)),
      new Promise((resolve, reject) => stream.once('error', reject)),
    ]);
    if (!res) break;
    stream.removeAllListeners('data');
    stream.removeAllListeners('end');
    stream.removeAllListeners('error');

    // .. do something
  }
});
```
