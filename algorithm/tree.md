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

本质是模拟递归，要用到栈

#### 前序

初始化栈，根节点入栈

当栈不为空时

-   弹出栈顶元素，将值加入结果中

-   若右子树非空，右子树入栈

-   若左子树非空，左子树入栈

栈是先进后出/后进先出的，这样遍历就是根->左->右的结构

```js
const preOrderTraverse = (root) => {
    if (!root) return [];
    const stack = [root],
        res = [];
    while (stack.length) {
        const node = stack.pop();
        res.push(node.val);
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }
    return res;
};
```

#### 中序

初始化栈为空，循环条件：root 有值/栈有元素

最左子树依次加入到栈中，然后取栈顶元素 tmp 并输出结果，然后取 tmp 的右子树为 root，继续循环

（到达最左子节点 tmp1，其右子树为 null，此时循环条件 root 不成立，但 stack.length > 0（最少有一个根节点），所以可以继续循环）

```js
const inOrderTraverse = (root) => {
    if (!root) return [];
    const stack = [],
        res = [];
    while (root || stack.length) {
        while (root) {
            stack.push(root);
            root = root.left;
        }
        root = stack.pop();
        res.push(root.val);
        root = root.right;
    }
    return res;
};
```

#### 后序

跟前序差不多，区别：

前序是中->左->右，写法是 push(val), push(node.right), push(node.left)

后序是左->右->中，修改前序的，push(val), push(node.left), push(node.right) 得出来的结果是中->右->左，数组反转即可得到答案

```js
const postOrderTraverse = (root) => {
    if (!root) return [];
    const reverse = (array) => {
        const length = array.length;
        for (let i = 0; i < Math.floor(length / 2); i++) {
            [array[i], array[length - 1 - i]] = [
                array[length - 1 - i],
                array[i],
            ];
        }
        return array;
    };
    const stack = [root],
        res = [];
    while (stack.length) {
        const node = stack.pop();
        res.push(node.val);
        if (node.left) stack.push(node.left);
        if (node.right) stack.push(node.right);
    }
    return reverse(res);
};
```
