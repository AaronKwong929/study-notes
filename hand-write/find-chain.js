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

const data = [
  { id: 1, title: `title1` },
  { id: 2, title: `title2` },
  { id: 3, title: `title3` },
  { id: 4, title: `title` },
];

const result = find(data)
  .where({ id: 1, title: `title1` }) // , title: /\d$/
  .orderBy(`id`, `desc`);

console.log(result.value);
