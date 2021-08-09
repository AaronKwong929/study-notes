# 如何实现一个 ORM 类似的 find 链式调用

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210809095412.png)

通过返回一个对象，里面的`this`指向这个对象本身 ==> 满足题目返回`result.value` 以及支持链式调用

`Object.entries` 将对象转为数组 `{ a: 1, b: 2 }` ==> `[["a", 1], ["b", 2]]`

```js
function find(value) {
  return {
    value,
    where(match) {
      // 直接使用 filter
      this.value = this.value.filter(item => {
        // filter ==> 返回是 true 才保留，否则过滤
        // every 判断当前 item 是否完全满足 match 完全满足才返回 true 提供 filter 保留
        // 解构获取到 key 和 正则表达式 / 目标值
        return Object.entries(match).every(([key, value]) => {
          // 如果是正则表达式，则用 value 去 test 目标值，命中返回true
          if (value instanceof RegExp) {
            return value.test(item[key]);
          }
          // 不是正则表达式，直接判断 item[key] 是否和 value 相等
          return item[key] === value;
        });
      });
      return this;
    },

    orderBy(key, type) {
      this.value.sort((x, y) =>
        type !== 'desc' ? x[key] - y[key] : y[key] - x[key]
      );
      return this;
    },
  };
}
```
