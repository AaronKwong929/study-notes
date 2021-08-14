// 判断是不是对象
const isObject = source => {
  const type = typeof source;
  return type === `function` || (type === `object` && source !== null);
};

// while 迭代器 - 性能优化
const forEach = (list, iterator) => {
  let index = -1;
  while (++index < list.length) {
    iterator(list[index]);
  }
};

const deepClone = (source, map = new Map()) => {
  // 基本类型 直接返回
  if (!isObject(source)) return source;
  else {
    // 否则进行递归调用
    const res = Array.isArray(source) ? [] : {};
    // 命中缓存直接返回
    if (map.get(source)) return map.get(source);
    // 设置缓存
    map.set(source, res);
    const keys = Object.keys(source);
    forEach(keys, item => {
      res[item] = deepClone(source[item], map);
    });
    return res;
  }
};

const a = { a: 1, b: { c: [1, 2, { d: `4` }] } };
const b = a;
console.log(a === b);
const c = deepClone(a);
console.log(JSON.stringify(c));
console.log(a === c);
