# N 数之和

> 学习东哥的 N 数之和[通用解法](https://mp.weixin.qq.com/s/fSyJVvggxHq28a0SdmZm6Q)

## 二数之和

通常会直接使用 O(N)的哈希表来解决

```js
var twoSum = function (nums, target) {
  const hash = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (hash.has(target - nums[i])) return [hash.get(target - nums[i]), i];
    hash.set(nums[i], i);
  }
};
```

为通用写法先写成排序数组+双指针的 O(NlogN)

```js
var twoSum = function (nums, start, target) {
  const res = [];
  // nums.sort((a, b) => a - b); // NOTE: 去掉，不用重复排序
  let low = start, // NOTE: 这里改成了 start
    high = nums.length - 1;
  while (low < high) {
    let left = nums[low],
      right = nums[high],
      sum = left + right;
    if (sum === target) {
      res.push([low, high]);
      while (low < high && nums[low] == left) low++;
      while (low < high && nums[high] == right) high--;
    } else if (num < target) while (low < high && nums[low] == left) low++;
    else while (low < high && nums[high] == right) high--;
  }
  return res;
};
```

## 三数之和

其实和二数之和差不多，暴力法 O(n^3)，这个解法只需要 O(n^2)

循环底部的 while 防止数重复

for 里面的内容和二数之和一样

```js
var threeSum = function (nums) {
  nums.sort((a, b) => a - b);
  const res = [],
    { length } = nums;
  for (let i = 0; i < length; i++) {
    let left = i + 1,
      right = length - 1;
    while (left < right) {
      const leftVal = nums[left],
        rightVal = nums[right],
        sum = leftVal + rightVal + nums[i];
      if (sum === 0) {
        res.push([nums[i], leftVal, rightVal]);
        while (left < right && leftVal === nums[left]) left++;
        while (left < right && rightVal === nums[right]) right--;
      } else if (sum < 0) while (left < right && leftVal === nums[left]) left++;
      else while (left < right && rightVal === nums[right]) right--;
    }
    while (i < length && nums[i] === nums[i + 1]) i++;
  }
  return res;
};
```

### 三数之和抽象化，把 0 换成 target 也是可以的

## 四数之和

还是参考三数之和，将时间复杂度降到 O(n^3)

```js
var fourSum = function (nums, target) {
  const { length } = nums;
  if (length < 4) return [];
  const res = [];
  nums.sort((a, b) => a - b);
  for (let i = 0; i < length - 3; i++) {
    for (let j = i + 1; j < length - 2; j++) {
      let left = j + 1,
        right = length - 1;
      while (left < right) {
        const leftVal = nums[left],
          rightVal = nums[right];
        const sum = nums[i] + nums[j] + leftVal + rightVal;
        if (sum === target) {
          res.push([nums[i], nums[j], leftVal, rightVal]);
          while (left < right && leftVal === nums[left]) left++;
          while (left < right && rightVal === nums[right]) right--;
        } else if (sum < target) left++;
        else right--;
      }
      while (j < length && nums[j] === nums[j + 1]) j++;
    }
    while (i < length && nums[i] === nums[i + 1]) i++;
  }
  return res;
};
```

## N 数之和？

如果是五数六数七数之和呢？一层一层写会写到头都大，观察 2 3 4 数之和，是有固定模式的

1. 使用递归来解决这个问题，首先是先判断 n ，如果 n < 2 那就不用求和了，同理如果数组长度< n，例如 [1, 2, 3]，求四数之和。

2. 然后是递归的 base case，直接使用二数之和

3. 大于 2 的情况，递归调用 nSumTarget 即可，不过要记得 start 从 `i + 1` 开始，n 取 `n - 1`

```js
// 记得在调用之前排序
var nSumTarget = function (nums, n, start, target) {
  const { length } = nums;
  const res = [];
  if (n < 2 || length < n) return res;
  if (n === 2) {
    let low = start,
      high = length - 1;
    while (low < high) {
      let left = nums[low],
        right = nums[high];
      let sum = left + right;
      if (sum === target) {
        res.push([left, right]);
        while (low < high && left === nums[low]) low++;
        while (low < high && right === nums[high]) high++;
      } else if (sum < target) low++;
      else high--;
    }
  } else {
    for (let i = start; i < length; i++) {
      const subRes = nSumTarget(nums, n - 1, i + 1, target - nums[i]);
      for (const sub of subRes) {
        res.push([...sub, nums[i]]);
      }
      while (i < length - 1 && nums[i] === nums[i + 1]) i++;
    }
  }
  return res;
};
```

### 通用解法解四数之和

```js
var fourSum = function (nums, target) {
  nums.sort((a, b) => a - b);
  return nSumTarget(nums, 4, 0, target);
};
```

### 通用解法解三数之和

```js
var ThreeSum = function (nums) {
  nums.sort((a, b) => a - b);
  return nSumTarget(nums, 3, 0, 0);
};
```
