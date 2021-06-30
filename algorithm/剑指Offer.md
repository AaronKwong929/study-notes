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
