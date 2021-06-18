# 二叉树的一些东西

## 路径问题

参考[这里](https://leetcode-cn.com/problems/binary-tree-paths/solution/yi-pian-wen-zhang-jie-jue-suo-you-er-cha-5f58/)的模板解法

考的是 DFS，257/988 题

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

988 无非加了个字符串倒置和结果排序，额外注意比较字符串不能在sort里写(a,b)=> a-b，**字符串相减结果不是正负数**

```js
// 988
/**
 * @param {TreeNode} root
 * @return {string}
 */
var smallestFromLeaf = function (root) {
    const res = [];
    const reverse = (string) => {
        let result = ``;
        for (let i of string) {
            result = i + result;
        }
        return result;
    };
    const dfs = (root, path) => {
        if (!root) return;
        path += String.fromCharCode(root.val + 97);
        if (root.left === null && root.right === null) {
            res.push(reverse(path));
            return;
        }
        dfs(root.left, path);
        dfs(root.right, path);
    };
    dfs(root, ``);
    res.sort((a, b) => {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    });
    return res[0];
};
```
