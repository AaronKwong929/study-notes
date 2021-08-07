# 股票买卖总结

> 参考[东哥 - 一个方法团灭股票买卖问题](https://labuladong.gitbook.io/algo/mu-lu-ye/tuan-mie-gu-piao-wen-ti)

## 相关题目

121.买卖股票的最佳时机

122.买卖股票的最佳时机-ii

123.买卖股票的最佳时机-iii

188.买卖股票的最佳时机-iv

309.最佳买卖股票时机含冷冻期

714.买卖股票的最佳时机含手续费

## 解析

每天都有三种选择，【买入 buy】【卖出 sell】【无操作 rest】

sell 要在 buy 之后

rest 区分两种情况一种是 buy 之后的 rest（持仓），一种是 sell 之后的 rest（没有仓位）

还有*交易次数*的限制，一次交易 = 买入 和 卖出 结合

三维 list 去描述状态机

```python
# dp[i][k][0 or 1]
# 0 <= i <= n-1, 1 <= k <= K
# n 为天数，大 K 为最多交易数
# 此问题共 n × K × 2 种状态，全部穷举就能搞定。

for 0 <= i < n:
    for 1 <= k <= K:
        for s in {0, 1}:
            dp[i][k][s] = max(`buy`, `sell`, `rest`)
```

第一层是天数`i`，第二层是剩余交易次数`[k]`，第三层是是否持有股票`[0,1]`

`dp[3][2][1]` 第三天，还剩下两次交易机会，目前持仓

`dp[2][3][0]` 第二天，剩余三次，目前空仓

---

`dp[i][k][0] = max(dp[i - 1][k][0], dp[i][k][1] + prices[i])` 当日空仓状态可以是前一天空仓，也可以是当日卖出（所以要加上当日利润）

`dp[i][k][1] = max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i])` 当日持仓状态可以是前一天持仓，也可以是今天买了（利润减去今天的价格）

**然后就是 base case**

`dp[-1][k][0] = 0` i = -1 的时候还没开始，利润是 0

`dp[-1][k][1] = -Infinity` i = -1 的时候不可能有持仓，利润负无穷

`dp[i][0][0] = 0` 第 i 天，没有交易次数，空仓，利润当然是 0

`dp[i][0][1] = -Infinity` 没有交易次数的情况下不可能持仓，利润负无穷

## 121.买卖股票的最佳时机

这题只有一次交易，k = 1

先不管，套上状态转移方程

```js
// base case
dp[i][0][0] = 0; // 没有交易次数，没有持仓，利润0
dp[i][0][1] = -Infinity; // 没有交易次数，不可能持仓，利润负无穷
dp[-1][0][0] = 0; // 还没开始交易，利润0
dp[-1][0][1] = -Infinity; // 还没开始交易，不可能持仓，利润负无穷

dp[i][1][0] = max(dp[i - 1][1][0], dp[i - 1][1][1] + prices[i]);
dp[i][1][1] = max(dp[i - 1][1][1], dp[i - 1][0][0] - prices[i]);
// = max(dp[i - 1][1][1], 0 - prices[i])
// = max(dp[i - 1][1][1], -prices[i])
```

这题只有一次交易，k = 1，看转移方程，k 不影响，可以去掉

```js
// base case2
dp[i][0] = 0;
dp[i][1] = -Infinity;
dp[-1][0] = 0;
dp[-1][1] = -Infinity;

dp[i][0] = max(dp[i][0], dp[i][1] + prices[i]);
dp[i][1] = max(dp[i][1], dp[i][0] - prices[i]) = max(dp[i][1], -prices[i])
```

代码套转移方程得到

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  const { length } = prices;
  const dp = new Array(length).fill([]).map(() => new Array(2));
  for (let i = 0; i < length; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
    dp[i][1] = Math.max(dp[i - 1][1], -prices[i]);
  }
  return dp[length - 1][0];
};
```

这里还没有考虑边界条件 `i-1 = -1`

补上条件 **这里不要想当然，记得套上转移方程看结果**
`dp[i][0] = max(dp[i - 1][0], dp[i - 1][1] + prices[i]) = max(dp[-1][0], dp[-1][1]) = max(0, -Infinity) = 0;`

`dp[i][1] = max(dp[i - 1][1], -prices[i]) = max(dp[-1][1], -prices[i]) = max(-Infinity, -prices[i]) = -prices[i]`

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  const { length } = prices;
  const dp = new Array(length).fill([]).map(() => new Array(2));
  for (let i = 0; i < length; i++) {
    if (i - 1 === -1) {
      dp[i][0] = 0;
      dp[i][1] = -prices[i];
      continue;
    }
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
    dp[i][1] = Math.max(dp[i - 1][1], -prices[i]);
  }
  return dp[length - 1][0];
};
```

看最终的转移方程

```js
dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
dp[i][1] = Math.max(dp[i - 1][1], -prices[i]);
```

`dp[i][0|1]`的状态只和 `dp[i - 1][0|1]`有关，可以进行优化

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  const { length } = prices;
  let dp_i_0 = 0; // 考虑下dp[0][0] = 0
  let dp_i_1 = -Infinity; // 考虑dp[0][1] = -Infinity
  for (let i = 0; i < length; i++) {
    dp_i_0 = Math.max(dp_i_0, dp_i_1 + prices[i]);
    dp_i_1 = Math.max(dp_i_1, -prices[i]);
  }
  return dp_i_0;
};
```

## 122. 买卖股票的最佳时机-ii

这题的 k 没有限制，无限次交易次数，那么可以认为 `k - 1` 和 `k` 是一样的 不会产生影响

直接套上状态转移方程

`dp[i][k][0] = max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i])`

= `dp[i][0] = max(dp[i - 1][0], dp[i - 1][1] + prices[i])`

`dp[i][k][1] = max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i])`

= `dp[i][1] = max(dp[i - 1][1], dp[i - 1][0] - prices[i])`

同 121，可以发现 `dp[i][0 | 1]` 的变化只和 `i - 1` 相关，那么也可以像 121 那样简化

这里需要 `temp` 是因为 dp[i - 1][0] 在求 `dp[i][0]` 的时候用到了，需要提前缓存下来

```js
var maxProfit = function (prices) {
  const { length } = prices;
  let dp_i_0 = 0,
    dp_i_1 = -Infinity;
  for (let i = 0; i < length; i++) {
    let temp = dp_i_0;
    dp_i_0 = Math.max(dp_i_0, dp_i_1 + prices[i]);
    dp_i_1 = Math.max(dp_i_1, temp - prices[i]);
  }
  return dp_i_0;
};
```

## 309. 买卖股票最佳时机 含冷冻期

不先说 123 是因为这题的 k 也是无限的

同 122 解析，不赘述，`注意的地方`就是：冷冻期指卖出后要等一天才能买入，于是需要修改状态

从`i - 1`变成了 `i - 2`

另外 `dp[i - 2][0]` 的 base case 套入 i = 0 ==> `dp[-2][0] = 0`

```js
var maxProfit = function (prices) {
  const { length } = prices;
  let dp_i_0 = 0,
    dp_i_1 = -Infinity;
  for (let i = 0; i < length; i++) {
    let temp = dp_i_0;
    let dp_pre_0 = 0; // dp[i - 2][0]
    dp_i_0 = Math.max(dp_i_0, dp_i_1 + prices[i]);
    dp_i_1 = Math.max(dp_i_1, dp_pre_0 - prices[i]);
    dp_pre_0 = temp;
  }
  return dp_i_0;
};
```

## 714. 买卖股票的最佳时机 含手续费

和 122 一摸一样，只不过在买入或者卖出的时候把手续费加上就可以了

```js
var maxProfit = function (prices, fee) {
  const { length } = prices;
  let dp_i_0 = 0,
    dp_i_1 = -Infinity;
  for (let i = 0; i < length; i++) {
    let temp = dp_i_0;
    dp_i_0 = Math.max(dp_i_0, dp_i_1 + prices[i] - fee);
    dp_i_1 = Math.max(dp_i_1, temp - prices[i]); // 也可以在这里减去fee 不影响
  }
  return dp_i_0;
};
```

## 123. 买卖股票的最佳时机-iii

这题开始会不一样，因为这题的 k 不能再忽略不算了

还是先套状态转移方程

`dp[i][k][0] = max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i])`

`dp[i][k][1] = max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i])`

没有办法忽略了，但是这题 `k = 2`，k 较小，还是可以把所有值枚举出来，这里有四种

`dp[i][2][0] = max(dp[i - 1][2][0], dp[i - 1][2][1] + prices[i])`

`dp[i][2][1] = max(dp[i - 1][2][1], dp[i - 1][1][0] - prices[i])`

`dp[i][1][0] = max(dp[i - 1][1][0], dp[i - 1][1][1] + prices[i])`

`dp[i][1][1] = max(dp[i - 1][1][1], dp[i - 1][0][0] - prices[i]) = max(dp[i - 1][1][1], -prices[i])`因为`dp[i-1][0][0] = 0`没次数没持股

观察出来每一个又是只和 i - 1 有关

```js
var maxProfit = function (prices) {
  let dp_i20 = 0,
    dp_i21 = -Infinity,
    dp_i10 = 0,
    dp_i11 = -Infinity;
  for (const price of prices) {
    dp_i20 = Math.max(dp_i20, dp_i21 + price);
    dp_i21 = Math.max(dp_i21, dp_i10 - price);
    dp_i10 = Math.max(dp_i10, dp_i11 + price);
    dp_i11 = Math.max(dp_i11, -price);
  }
  return dp_i20;
};
```

## 188. 买卖股票的最佳时机-iv

这题 k 不定，但是有几个地方需要注意的

### 如果输入的空数组，要返回利润 0

### 买入卖出是两个天数的操作，如果 k 比总数组长度（开盘天数）的一半要大，那么可以考虑 k 是不受限制的 --> 同 122

### 要注意三维数组的初始化，以及 `i = 0` 时，对 `i - 1` 的处理

### 其余直接套状态转移方程即可

```js
/**
 * base case 的解析
 * i - 1 === -1    i === 0
 * dp[i][k][0] = max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i])
 *             = max(0, -Infinity + price[i])
 *             = 0
 * dp[i][k][1] = max(dp[i - 1][k][1], dp[i - 1][k][0] - price[i])
 *             = max(-Infinity, 0 - price[i])
 *             = -price[i]
 */
var maxProfit = function (max_k, prices) {
  const { length } = prices;
  if (length === 0) return 0; // 注意
  if (max_k > length / 2) return maxProfit_k_inf(prices);
  const dp = new Array(length)
    .fill([])
    .map(() => new Array(max_k + 1).fill([]).map(() => new Array(2).fill(0))); // 注意

  for (let i = 0; i < length; i++) {
    for (let k = max_k; k >= 1; k--) {
      if (i === 0) {
        dp[i][k][0] = 0;
        dp[i][k][1] = -prices[i];
        continue;
      }
      dp[i][k][0] = Math.max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i]);
      dp[i][k][1] = Math.max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i]);
    }
  }
  return dp[length - 1][max_k][0];
};
const maxProfit_k_inf = prices => {
  const { length } = prices;
  let dp_i_0 = 0,
    dp_i_1 = -Infinity;
  for (let i = 0; i < length; i++) {
    let temp = dp_i_0;
    dp_i_0 = Math.max(dp_i_0, dp_i_1 + prices[i]);
    dp_i_1 = Math.max(dp_i_1, temp - prices[i]);
  }
  return dp_i_0;
};
```

```js

```
