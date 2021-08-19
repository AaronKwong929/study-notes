# 虚拟 DOM 和 diff 算法

## Virtual DOM

Virtual DOM 是一个对象，表示真实 DOM

```html
<ul id="list">
  <li class="item">a</li>
  <li class="item">b</li>
  <li class="item">c</li>
</ul>
```

对应的虚拟 DOM

```js
let oldVDOM = {
  // 旧虚拟DOM
  tagName: 'ul', // 标签名
  props: {
    // 标签属性
    id: 'list',
  },
  children: [
    // 标签子节点
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['a'],
    },
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['b'],
    },
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['c'],
    },
  ],
};
```

将第三个`li`标签改成 d

```html
<ul id="list">
  <li class="item">a</li>
  <li class="item">b</li>
  <li class="item">d</li>
</ul>
```

生成的新虚拟 dom

```js
let newVDOM = {
  tagName: 'ul', // 标签名
  props: {
    // 标签属性
    id: 'list',
  },
  children: [
    // 标签子节点
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['a'],
    },
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['b'],
    },
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['d'], // NOTE: 这里
    },
  ],
};
```

**虚拟 DOM 比真实 DOM 快** ===> 错误/不严谨

应该是：**虚拟 DOM + diff 算法** 比 `真实 DOM `快

## Diff

`同层`对比新旧 VDOM，不能更新未发生改变的节点，减少重绘重排

当数据改变时，会触发 setter，并且通过 Dep.notify 去通知所有订阅者 Watcher，订阅者们就会调用 patch 方法，给真实 DOM 打补丁，更新相应的视图。

`patch`,`sameVNode`,`patchVnode`,`updateChildren`

[详细解释看这里](https://juejin.cn/post/6994959998283907102?utm_source=gold_browser_extension#heading-9)

https://blog.shenfq.com/posts/2019/%E8%99%9A%E6%8B%9FDOM%E5%88%B0%E5%BA%95%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F.html

## 其他问题

### 为何 v-for 不要用 index 直接做 key

`[a, b, c]` ==> `[aa, a, b, c]`

如果数组头部增加了内容，原来的 key 值都会被+1 ，在 diff 算法过程中，进行`sameNode`对比，0，1，2 都命中 -- 命中的节点进行`patchNode`更新文本，
因为原来没有 key=4 的 c 节点，走新增流程，**所以全部节点都被更新了**

所以，如果用 unique 值去作 key，sameNode 命中，patchNode 也不会去做更新操作，直接复用，所以只有新的 aa 标签会变动被挂载上去，其他标签不会更新
