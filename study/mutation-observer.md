# MutationObserver

## 是什么？

先来看 MDN 的解释 [MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)

就是一个用来检测 DOM 变化的 API，调用时传入回调函数，在指定的 DOM 发生变化的时候会被调用

## 可以用来做什么？

通知用户所在页面发生的某些变化

... <== (我暂时还没想到)

## 怎么用？

写一个发生变化时打印出来的监听

```js
const mutationObserver = new MutationObserver(mutations =>
  mutations.forEach(mutation => {
    console.log(mutation);
  })
);
```

创建出来的`mutationObserver`有三个方法

`observe` - 开始监听，接收参数：被监听的 DOM 节点，options

`disconnect` - 停止监听

`takeRecords` - "触发回调前返回最新的批量 DOM 变化"，MDN 解释如下

> 从 MutationObserver 的通知队列中删除所有待处理的通知，并将它们返回到 MutationRecord 对象的新 Array 中。

就是主动从通知队列里面拉取所有待处理通知，然后不会触发 callback

区别于 callback 被动等待变化触发回调

```js
// 开始监听页面根元素 HTML 变化
mutationObserver.observe(document.documentElement, {
  attributes: true, // 观察被监视元素属性值变更
  characterData: true, // 监视指定目标节点或子节点树中节点所包含的字符数据的变化
  childList: true, // 监视目标节点（如果 subtree 为 true，则包含子孙节点）添加或删除新的子节点
  subtree: true, // 监视范围扩展至目标节点整个节点树中的所有节点
  attributeOldValue: true, // 记录任何有改动的属性的上一个值
  characterDataOldValue: true, // 记录受监视节点上发生更改时记录节点文本的先前值
});

console.log('records ', mutationObserver.takeRecords());

mutationObserver.disconnect();
```

具体的实践需要业务支撑，之后运用到了会补上
