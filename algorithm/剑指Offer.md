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

注意 high 是 numbers.length-1，【左闭右闭区间】循环终点为 low < high

~~high 是 numbers.length 的话，【左闭右开区间】循环终点 low <= high （不在本次讨论范围）~~

```js
const pivot = low + Math.floor((high - low) / 2);
```

> 我们考虑数组中的最后一个元素 x：在最小值右侧的元素（不包括最后一个元素本身），它们的值一定都严格小于 x；而在最小值左侧的元素，它们的值一定都严格大于 x。因此，我们可以根据这一条性质，通过二分查找的方法找出最小值。

> 作者：LeetCode-Solution 链接：https://leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array/solution/xun-zhao-xuan-zhuan-pai-xu-shu-zu-zhong-5irwp/

情况 1：numbers[pivot] < numbers[high]，-> 最低点在 pivot 左边 high = pivot

情况 2：numbers[pivot] > numbers[high] -> 最低点一定在 pivot 右边 -> low = pivot + 1

### 为什么 high = pivot 而 low = pivot + 1？

贴一个大佬的解析

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210630161045.png)

上图底部说的[大佬的总结](https://leetcode-cn.com/problems/search-insert-position/solution/te-bie-hao-yong-de-er-fen-cha-fa-fa-mo-ban-python-/)

### 完整代码

```js
var minArray = function (numbers) {
    let low = 0;
    let high = numbers.length - 1;

    if (numbers[high] > numbers[low]) return numbers[low]; // 先考虑特殊情况，没有旋转数组，直接返回第一个数字

    while (low < high) {
        const pivot = low + Math.floor((high - low) / 2);
        if (numbers[pivot] < numbers[high]) {
            high = pivot;
        } else {
            low = pivot + 1;
        }
    }
    return numbers[low];
};

// if (numbers[pivot] < numbers[high]) {
//     high = pivot;
// } else if (numbers[pivot] > numbers[high]) {
//     low = pivot + 1;
// } else {
//     high -= 1;
// }
```

上边注释的是针对有相同元素的情况，本题对应 153 题，注释对应 154 题
