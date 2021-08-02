# 剑指 Offer 的部分题目的理解

## [剑指 Offer 09. 用两个栈实现队列](https://leetcode-cn.com/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/)

题目一开始确实看不懂，感谢评论区大佬的解释，这里直接饮用大佬原文

![question-explanation.png](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210630104958.png)

看着题目很复杂其实不然，使用两个栈（先进后出 push/pop）来模拟队列（先进先出 push/shift）

画两个图，这个是初始状态

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210630105327.png)

往入栈里 push 两个数：1，2

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210630105429.png)

然后这时候想要模拟队列先进先出，那就需要对出入栈进行操作

将入栈里的数全部丢到出栈里

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210630105612.png)

然后出栈的栈顶就是第一个进入入栈的数字了

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210630105745.png)

以此类推即可模拟完成

### 完整代码

```js
var CQueue = function () {
  this.stackA = [];
  this.stackB = [];
};

/**
 * @param {number} value
 * @return {void}
 */
CQueue.prototype.appendTail = function (value) {
  this.stackA.push(value);
  return;
};

/**
 * @return {number}
 */
CQueue.prototype.deleteHead = function () {
  if (this.stackB.length) return this.stackB.pop();
  while (this.stackA.length) this.stackB.push(this.stackA.pop());
  if (!this.stackB.length) return -1;
  return this.stackB.pop();
};

/**
 * Your CQueue object will be instantiated and called as such:
 * var obj = new CQueue()
 * obj.appendTail(value)
 * var param_2 = obj.deleteHead()
 */
```

## [剑指 Offer 11. 旋转数组的最小数字](https://leetcode-cn.com/problems/xuan-zhuan-shu-zu-de-zui-xiao-shu-zi-lcof/)

最无脑的解法 O(n)遍历一次

稍好一点的解法找升序断层如 [4, 5, 6, 1, 2, 3] 6 > 1 返回 1

↑ 但都不是最优解

最优解：二分查找

注意 high 是 numbers.length-1，【左闭右闭区间】循环条件 low < high

~~high 是 numbers.length 的话，【左闭右开区间】循环条件 low <= high （不在本次讨论范围）~~

```js
const pivot = low + Math.floor((high - low) / 2);
```

> 我们考虑数组中的最后一个元素 x：在最小值右侧的元素（不包括最后一个元素本身），它们的值一定都严格小于 x；而在最小值左侧的元素，它们的值一定都严格大于 x。因此，我们可以根据这一条性质，通过二分查找的方法找出最小值。

> 作者：LeetCode-Solution 链接：https://leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array/solution/xun-zhao-xuan-zhuan-pai-xu-shu-zu-zhong-5irwp/

情况 1：numbers[pivot] < numbers[high]，-> 最低点在 pivot 左边 high = pivot

情况 2：numbers[pivot] > numbers[high] -> 最低点一定在 pivot 右边 -> low = pivot + 1

### 为什么 high = pivot 而 low = pivot + 1？

详情看东哥的[解析](https://labuladong.gitbook.io/algo/mu-lu-ye-1/mu-lu-ye-3/er-fen-cha-zhao-xiang-jie#si-luo-ji-tong-yi)

`let left = 0, right = length - 1`，`决定`了这是`左闭右闭`区间，就`决定`了循环条件是`left <= right`，也`决定`了`left = mid + 1`与`right = mid - 1`（mid 值是在区间里的，但 mid 值不是目标值，right = mid - 1）

而`let left = 0, right = length`，`决定`了这是`左闭右开`区间，就`决定`了循环条件是`left < right`，也`决定`了`left = mid + 1`与`right = mid`（mid 值不在区间里，mid 值可能是目标值，right = mid）

### 完整代码

```js
/**
 * @param {number[]} numbers
 * @return {number}
 */
var minArray = function (numbers) {
  const { length } = numbers;
  let left = 0,
    right = length - 1;
  if (numbers[0] < numbers[length - 1]) return numbers[0];
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (numbers[mid] > numbers[mid] + 1) return numbers[mid + 1];
    else if (numbers[mid] < numbers[mid - 1]) return numbers[mid];
    else if (numbers[mid] > numbers[left]) left = mid + 1;
    else right = mid - 1;
  }
  return numbers[left];
};
```

### 类似题目 153（本题），154（进阶题）

## [剑指 Offer 13. 机器人的运动范围](https://leetcode-cn.com/problems/ji-qi-ren-de-yun-dong-fan-wei-lcof/)

> 类似于 “向上/下/左/右移动” 的题目要想到采用 BFS 解决，考虑 方格临界值 以及 题目本身限制条件

### 计算位数和

```js
const getSum = num => {
  let res = 0;
  while (num) {
    res += num % 10;
    // 向下取整，因为可能出现小数
    num = Math.floor(num / 10);
  }
  return res;
};
```

### 四周方向遍历

> 使用方向数组进行遍历

这个和之前的小岛陆地题，以及螺旋数组输出是相似的

```js
// 方向数组
const directions = [
  [-1, 0], // 上
  [0, 1], // 右
  [1, 0], // 下
  [0, -1], // 左
];
```

### 限制条件

1. 不能超过数组边界

```js
i >= 0;
j >= 0;
i < m;
j < n;
```

2. 行列坐标位数和不能大于 k

```js
getSum(i) + getSum(j) < k;
```

3. 已到达过的单元格不计入统计范围内【重点】

### 完整代码

```js
/**
 * @param {number} m
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var movingCount = function (m, n, k) {
  const getSum = num => {
    let res = 0;
    while (num) {
      res += num % 10;
      num = Math.floor(num / 10);
    }
    return res;
  };

  const directions = [
    // [-1, 0], // 向上
    // [0, -1], // 向左
    [1, 0], // 向下
    [0, 1], // 向右
  ];

  // 已走过的坐标
  const set = new Set([`0,0`]);

  // 遍历的坐标队列
  let queue = [[0, 0]];
  while (queue.length) {
    // 移除队首
    const [x, y] = queue.shift();

    // 遍历方向
    for (let i = 0; i < directions.length; i++) {
      const newX = x + directions[i][0];
      const newY = y + directions[i][1];

      // 临界判断
      if (
        newX < 0 ||
        newY < 0 ||
        newX >= m ||
        newY >= n ||
        getSum(newX) + getSum(newY) > k ||
        set.has(`${newX},${newY}`)
      )
        continue;

      set.add(`${newX},${newY}`);
      queue.push([newX, newY]);
    }
  }
  return set.size;
};
```

> 此处 set 记录已走过的格子，set key 的唯一性，返回 size 即可获得总格数

### 类似题目：289/999
