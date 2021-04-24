# 算法小记 - 链表

链表的题通常需要注意两点：

舍得用变量，千万别想着节省变量，否则容易被逻辑绕晕
head 有可能需要改动时，先增加一个 假 head，返回的时候直接取 假 head.next，这样就不需要为修改 head 增加一大堆逻辑了。

---来自[82.删除排序链表中的重复元素 Ⅱ - 中等题](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list-ii/) 官方题解下的评论

## [政采云算法 101](https://101.zoo.team/lian-biao)上关于链表题目的提示

![zoo-team-algo-101-link-list-tip1](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210406092526.png)
