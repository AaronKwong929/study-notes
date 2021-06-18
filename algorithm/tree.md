# 二叉树的一些东西

## 路径问题

参考[这里](https://leetcode-cn.com/problems/binary-tree-paths/solution/yi-pian-wen-zhang-jie-jue-suo-you-er-cha-5f58/)的模板解法

考的是 DFS，257/898 题

看递归终点 -> 叶子节点

递归函数可以传入一个辅助参数参与递归，这里是空字符串

```js
// 257
var binaryTreePaths = function (root) {
    const res = [];
    const dfs = (root, path) => {
        if (root) {
            path += root.val.toString();
            if (root.left === null && root.right === null) {
                res.push(path);
                return;
            }
            path += `->`;
            dfs(root.left, path);
            dfs(root.right, path);
        }
    };
    dfs(root, ``);
    return res;
};
```
