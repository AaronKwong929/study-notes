function groupBy(collection, by) {
  return collection.reduce((pre, cur) => {
    if (!pre[by(cur)]) {
      pre[by(cur)] = [];
    }
    pre[by(cur)].push(cur);
    return pre;
  }, {});
}

console.log(
  groupBy(
    [
      { id: 1, name: '山月', sex: 'male' },
      { id: 2, name: '张三', sex: 'female' },
      { id: 3, name: '李四', sex: 'female' },
    ],
    x => x.sex
  )
);
