# 二叉树相关

## BFS 和 DFS

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

<!-- TODO: 这里还没做 -->

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

## [前序、中序构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

leetCode 的第 105 题，这题思考了很久，最后还是看[官方题解](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/solution/cong-qian-xu-yu-zhong-xu-bian-li-xu-lie-gou-zao-9/)就明白是什么意思了

个人对于这种索引值传入的值会比较紧张，其实只需要画图就行了

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210622162542.png)

图里面已经写出来的索引值可以直接得到，关键就在于**前序左子树**的终点，以及**前序右子树**的起点（前者 + 1 得到）

由于**左子树长度相等**，求中序左子树长度

```js
const leftTreeLength = mid - inStart;
```

索引是从 0 开始算的，根节点索引 减去 中序左子树起点索引 即为长度

（其实就是 mid-1 - inStart + 1）

或者

```js
// [0, 1, 2, 3]
// 求子序列[0, 1, 2]的长度，将 3 当做根节点
// 3 - 0  或者 2 - 0 + 1 = 3
```

得到左子树长度后，前序左子树 的终点和 前序右子树 的起点就可以得到了

```js
preLeftEnd = preStart + leftTreeLength;

preRightStart = preStart + leftTreeLength + 1;
```

这里的 preLeftEnd 跟上面其实是一样的，举个例子

```js
// [0, 1, 2, 3]
// 0 是根节点，[1, 2, 3]是子树，子树长度为 3
// preLeftEnd = preStart + leftTreeLength = 0 + 3 = 3
```

得出来所有位置后进行递归即可

### 完整代码

```js
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
    const map = new Map();
    for (let i = 0; i < inorder.length; i++) {
        map.set(inorder[i], i);
    }
    const helper = (preStart, preEnd, inStart, inEnd) => {
        if (preStart > preEnd || inStart > inEnd) return null;
        const rootVal = preorder[preStart];
        const root = new TreeNode(rootVal);
        const mid = map.get(rootVal);
        const leftTreeLength = mid - inStart;
        root.left = helper(
            preStart + 1,
            preStart + leftTreeLength,
            inStart,
            mid - 1
        );
        root.right = helper(
            preStart + leftTreeLength + 1,
            preEnd,
            mid + 1,
            inEnd
        );
        return root;
    };
    return helper(0, preorder.length - 1, 0, inorder.length - 1);
};
```

## [106. 从中序与后序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

换汤不换药，画图获得各个关键位置的索引值即可

### 完整代码

```js
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function (inorder, postorder) {
    const map = new Map();
    for (let i = 0; i < inorder.length; i++) {
        map.set(inorder[i], i);
    }

    const helper = (inStart, inEnd, postStart, postEnd) => {
        if (inStart > inEnd || postStart > postEnd) return null;
        const rootVal = postorder[postEnd];
        const root = new TreeNode(rootVal);
        const mid = map.get(rootVal);
        const leftTreeLength = mid - inStart;
        root.left = helper(
            inStart,
            mid - 1,
            postStart,
            postStart + leftTreeLength - 1
        );
        root.right = helper(
            mid + 1,
            inEnd,
            postStart + leftTreeLength,
            postEnd - 1
        );
        return root;
    };
    return helper(0, inorder.length - 1, 0, postorder.length - 1);
};
```

## [96. 不同的二叉搜索树](https://leetcode-cn.com/problems/unique-binary-search-trees/)

要看[题解](https://leetcode-cn.com/problems/unique-binary-search-trees/solution/bu-tong-de-er-cha-sou-suo-shu-by-leetcode-solution/)

分解两个子问题且子问题解可以复用 -> dp

n 个节点，i 作为根节点，根节点左侧的子树数量为 dp[i-1]，根节点右侧子树数量为 dp[n-i]，所以 i 作为根节点拥有的子树形态为 dp[i] = dp[i-1]\*dp[n-i]

dp[i-1]和 dp[n-i]又可以分解为更多的子问题，所以这里会产生连加求和（第二层 for 循环）
