# Math.random 的一些实现

## Math.random()

> api 解释 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random

伪随机数在范围从 0 到小于 1，即包括 0，不包括 1 `[0, 1)`

## 实现 min, max 整数

### [min, max)

基本款，其他的都根据这个来变

```js
parseInt(Math.random() * (max - min) + min);
```

例如要`[4, 6)` random 返回`0 - 1随机数`，`[0, 1) * (6 - 4) + 4` = `[0, 2) + 4` = `[4, 6)`

### [min, max]

想要把 max 也包含进去，即生成一个`[min, max + 1)`，max + 1 代替原来的逻辑即可

```js
parseInt(Math.random() * (max + 1 - min) + min);
```

### (min, max]

跟上面一样，包含 max 即用`max + 1`替换 max

不想包含 min，则要用 `min + 1` 替换 min

```js
parseInt(Math.random() * (max + 1 - (min + 1)) + min + 1);
// ↓
parseInt(Math.random() * (max - min) + min + 1);
```

### (min, max)

同上，不包含 min，`min + 1` 替换 min，max 不变不用操作

```js
parseInt(Math.random() * (max - (min + 1)) + min + 1);
// ↓
parseInt(Math.random() * (max - min - 1) + min + 1);
```

### 测试

取 `[min, max)` 进行测试

```js
const count = {};
let min = 0,
  max = 5;
for (let i = 0; i < 100000; i++) {
  let cur = parseInt(Math.random() * (max - min) + min);
  if (!count[cur]) count[cur] = 1;
  else count[cur]++;
}
console.log(count);
```

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210809141908.png)

基本是相同概率的

### 实现 min, max 小数

```js
const getRandom = (min, max, count) =>
  (Math.random() * (max - min) + min).toFixed(count);
```
