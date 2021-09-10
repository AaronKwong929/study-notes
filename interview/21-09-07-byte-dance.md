# 2021.08.31 字节跳动 - 国际化电商 - 可能是二面（60 分钟）

1. 题库和重构细节

2. 题库的优化迭代有没有具体的数据可以支撑？

3. 前面几轮有没有碰到特别难的不会的点？

4. https tls 连接详情，几个 rtt

5. promise 优缺点

6. promise 怎么控制异步

7. 闭包

8. 继承

9. promise 输出顺序

10. typescript 泛型

11. 首页白屏优化

12. 算法

> 给定 m 个不同字符 [a, b, c, d]，以及长度为 n 的字符串 tbcacbdata，在其中找到一个长度为 m 的连续子串，使得这个子串刚好由这 m 个字符组成，顺序无所谓，返回任意满足条件的一个子串的起始位置，未找到返回-1。比如上面这个例子，acbd，3。

---

没憋出来

好像是滑动窗口题

```js
function getIndex(m, n) {
  let p = 0;
  let temp;
  for (let i = 0; i < n.length; i++) {
    const set = new Set();
    if (!m.includes(n[i])) continue;
    else {
      if (!set.has(n[i])) {
        set.add(n[i]);
        temp = i++;
        for (; temp < n.length; temp++) {
          if (!set.has(n[temp] && m.includes(n[temp]))) {
            console.log(`+1`, n[temp]);
            set.add(n[temp]);
            if (set.size === m.length) {
              return i;
            }
          } else {
            break;
          }
        }
      }
    }
  }
  return -1;
}

console.log(getIndex([`a`, `b`, `c`, `d`], `tbcacbdata`));
```
