# 封装获取数据类型的实践

基于这个方法进行拓展

```js
Object.prototype.toString.call(val).slice(8, -1);
```

下面是自由发挥时间

```js
export const isInt = val => /^[0-9]*$/.test(val);
export const isFloat = val => isNumber(val) && ~~val !== val;
export const isNumber = val => getRawType(val) === 'Number';
export const isString = val => getRawType(val) === 'String';
export const isBoolean = val => getRawType(val) === 'Boolean';
export const isUndefined = val => getRawType(val) === 'Undefined';
export const isNull = val => getRawType(val) === 'Null';
export const isObject = val => getRawType(val) === 'Object';
export const isFunction = val => getRawType(val) === 'Function';
export const isDate = val => getRawType(val) === 'Date';
export const isArray = val => getRawType(val) === 'Array';
export const isRegExp = val => getRawType(val) === 'RegExp';
export const isEmptyObject = obj => Object.keys(obj).length === 0;
```

比对两个浮点数是否相等

`0.1 + 0.2 === 0.3`是`false`，是 js 的 ieee754 精度引发的问题

通过比对两个数相减是否 `<= Number.EPSILON`来判断浮点数是否相同

```js
export const compareFloat = (a, b) => Math.abs(a - b) <= Number.EPSILON;
```
