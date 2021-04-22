# 做题遇到的小诀窍

一个数和自己异或 = 0 (a ^ a = 0); 一个数和 0 异或等于自身(a ^ 0 = a) -> ([136.只出现一次的数字](https://leetcode-cn.com/problems/single-number/))

遇到数组比大小，需要预设大小值时，最小值可以设置成 ⬇️ -> ([买卖股票的最佳时机 1 - 简单题](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/))

```js
let min = Number.MAX_SAFE_INTEGER;
let max = 0;
```
