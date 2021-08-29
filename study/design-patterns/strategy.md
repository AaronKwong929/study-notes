# 策略模式

`优点`：通常可以用在大段的 `if/else` 或者 `switch/case` 里，优化代码结构，增强可读性，易于扩展，避免大量重复代码

`缺点`：会产生许多策略类，不过可以接受，比直接写 if/else 和 switch/case 复制粘贴堆砌代码要好

最简单的一个实现：平时开发的 key-value 映射 map

```js
const xxxMap = Object.freeze({
  0: `xx`,
  1: `xxx`,
  2: `xxxx`,
});
```

```html
{{ xxxMap[data] }}
```

另一个详实一点的例子

```js
const strategies = Object.freeze({
  S(salary) {
    return salary * 4;
  },
  A(salary) {
    return salary * 3;
  },
  B(salary) {
    return salary * 2;
  },
});

const bonus = strategies[type](salary);
```
