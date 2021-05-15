# 封装获取数据类型的实践

```js
const getRawType = (val) => Object.prototype.toString.call(val).slice(8, -1);

export const isInt = (val) => /^[0-9]*$/.test(val);
export const isFloat = (val) => isNumber(val) && ~~val !== val;
export const isNumber = (val) => getRawType(val) === "Number";
export const isString = (val) => getRawType(val) === "String";
export const isBoolean = (val) => getRawType(val) === "Boolean";
export const isUndefined = (val) => getRawType(val) === "Undefined";
export const isNull = (val) => getRawType(val) === "Null";
export const isObject = (val) => getRawType(val) === "Object";
export const isFunction = (val) => getRawType(val) === "Function";
export const isDate = (val) => getRawType(val) === "Date";
export const isArray = (val) => getRawType(val) === "Array";
export const isRegExp = (val) => getRawType(val) === "RegExp";
export const isEmptyObject = (obj) => Object.keys(obj).length === 0;
export const compareFloat = (a, b) => Math.abs(a - b) <= Number.EPSILON;
```
