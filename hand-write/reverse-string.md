# 实现字符串翻转

1. O(n),O(n)

```js
const reverseString = str => {
  const res = [];
  for (let i = 0; i < str.length; i++) {
    res.unshift(str[i]);
  }
  return res.join(``);
};
```

2. O(logN),O(1)

```js
const reverseString = str => {
  let left = 0,
    right = str.length - 1;
  while (left < right) {
    [str[left], str[right]] = [str[right], str[left]];
    left++;
    right--;
  }
  return str;
};
```
