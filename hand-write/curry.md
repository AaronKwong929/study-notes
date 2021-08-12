# 实现函数柯里化

直到满足`fn`需要的参数之前都一直返回函数

## 关键点

 一个函数的长度等于它参数的个数

```js
const fn = (a, b, c) => a + b + c;
console.log(fn.length); // 3
```

基于这一点，在入参的时候就可以去判断，如果入参个数比`fn`的参数长度长，直接执行，否则返回一个函数

举例`const add = (a, b) => a + b`

如果这时候输入的是 `add(1)`，入参个数 < 需要个数===> 柯里化

`add(1)(2)`

```js
const curry = (fn, ...args) =>
    fn.length <= args.length
        ? fn(...args)
        : (..._args) => curry(fn, ...args, ..._args);
```

## 测试

```js
const curry = (fn, ...args) =>
    fn.length <= args.length
        ? fn(...args)
        : (..._args) => curry(fn, ...args, ..._args);

const add = (a, b, c) => a + b + c;

const add1 = curry(add);
console.log(add1(1)(2)(3));
console.log(add1(1)(2, 3));
console.log(add1(1, 2)(3));
console.log(add1(1, 2, 3));
```

## 复杂一点的 无限参数

实现数组连加

改写`toString`，返回 sum1

```js
function argsSum(args) {
    return args.reduce((pre, cur) => {
        return pre + cur;
    });
}
function add(...args1) {
    let sum1 = argsSum(args1);
    let fn = function (...args2) {
        let sum2 = argsSum(args2);
        return add(sum1 + sum2);
    };
    fn.toString = function () {
        return sum1;
    };
    return fn;
}
console.log(add(1, 2)(3)(4).toString());
```
