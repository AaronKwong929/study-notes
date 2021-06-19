# 二叉树的一些东西

## 路径问题

参考[这里](https://leetcode-cn.com/problems/binary-tree-paths/solution/yi-pian-wen-zhang-jie-jue-suo-you-er-cha-5f58/)的模板解法

### 自顶向下

从某一个节点开始（不一定要根节点），从上到下寻找路径，到某一个节点结束

257，112，113，437，988，面试题 04

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

988 无非加了个字符串倒置和结果排序，额外注意比较字符串不能在 sort 里写(a,b)=> a-b，**字符串相减结果不是正负数**

```js
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

类似 113 这种，传入的不是基本类型的辅助变量，在对其进行操作的时候记得深克隆

```js
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number[][]}
 */
var pathSum = function (root, targetSum) {
    // // 回溯
    // const res = [];
    // const dfs = (root, sum, path) => {
    //     if (!root) return;
    //     path.push(root.val);
    //     sum -= root.val;
    //     if (!root.left && !root.right && sum === 0) {
    //         res.push(path.slice());
    //     } else {
    //         dfs(root.left, sum, path);
    //         dfs(root.right, sum, path);
    //     }
    //     path.pop();
    // };
    // dfs(root, targetSum, []);
    // return res;

    // 递归
    const res = [];
    const dfs = (root, sum, path) => {
        if (!root) return;
        sum -= root.val;
        path.push(root.val);
        if (!root.left && !root.right && sum === 0) {
            res.push(path.slice());
            return;
        }
        dfs(root.left, sum, path.slice());
        dfs(root.right, sum, path.slice());
    };
    dfs(root, targetSum, []);
    return res;
};
```

### 非自顶向下

从任意节点到任意节点的路径，不自顶向下

124，687，543

看递归终点 -> 叶子节点

递归函数可以传入一个辅助参数参与递归，这里是空字符串

## 前序，中序，后序的递归/迭代方法

### 递归

```js
// 前序
const preOrderTraverse = (root) => {
    if (!root) return;
    console.log(root.val);
    preOrderTraverse(root.left);
    preOrderTraverse(root.right);
};

// 中序
const inOrderTraverse = (root) => {
    if (!root) return;
    console.log(root.val);
    inOrderTraverse(root.left);
    inOrderTraverse(root.right);
};

// 后序
const postOrderTraverse = (root) => {
    if (!root) return;
    postOrderTraverse(root.left);
    postOrderTraverse(root.right);
    console.log(root.val);
};
```

### 迭代