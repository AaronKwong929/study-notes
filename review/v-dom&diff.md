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

`同层`对比新旧 虚拟 DOM，不能更新未发生改变的节点，减少重绘重排

当数据改变时，会触发 setter，并且通过 Dep.notify 去通知所有订阅者 Watcher，订阅者们就会调用 patch 方法，给真实 DOM 打补丁，更新相应的视图。

`patch`,`sameVNode`,`patchVnode`,`updateChildren`

> 掘金上偷一张图[1]

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210825085334.png)

### patch 方法

- 对比当前层的节点是否同类型标签

  - 是 - 继续进行 patchNode

  - 否 - 节点替换成新节点

```js
function patch(oldVnode, newVnode) {
  // 比较是否为一个类型的节点
  if (sameVnode(oldVnode, newVnode)) {
    // 是：继续进行深层比较
    patchVnode(oldVnode, newVnode);
  } else {
    // 否
    const oldEl = oldVnode.el; // 旧虚拟节点的真实DOM节点
    const parentEle = api.parentNode(oldEl); // 获取父节点
    createEle(newVnode); // 创建新虚拟节点对应的真实DOM节点
    if (parentEle !== null) {
      api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl)); // 将新元素添加进父元素
      api.removeChild(parentEle, oldVnode.el); // 移除以前的旧元素节点
      // 设置null，释放内存
      oldVnode = null;
    }
  }
  return newVnode;
}
```

### sameNode 方法

一目了然 判断节点类型是否相同

```js
function sameVnode(oldVnode, newVnode) {
  return (
    oldVnode.key === newVnode.key && // key值是否一样
    oldVnode.tagName === newVnode.tagName && // 标签名是否一样
    oldVnode.isComment === newVnode.isComment && // 是否都为注释节点
    isDef(oldVnode.data) === isDef(newVnode.data) && // 是否都定义了data
    sameInputType(oldVnode, newVnode) // 当标签为input时，type必须是否相同
  );
}
```

### patchNode 方法

1. 找到真实 DOM ==> el

2. 判断 `newValue` 和 `oldValue` 是否同一对象，是 ==> return, 结束

3. 如果都有文本节点但不相同 - 将 el 的文本节点设置为 `newVnode` 的文本节点。

4. 如果 `oldVnode` 有子节点而 `newVnode` 没有，则删除 el 的子节点

5. 如果 `oldVnode` 没有子节点而 `newVnode` 有，则将 `newVnode` 的子节点真实化之后添加到 el

6. 如果两者都有子节点，则执行 `updateChildren` 函数比较子节点

```js
function patchVnode(oldVnode, newVnode) {
  const el = (newVnode.el = oldVnode.el); // 获取真实DOM对象
  // 获取新旧虚拟节点的子节点数组
  const oldCh = oldVnode.children,
    newCh = newVnode.children;
  // 如果新旧虚拟节点是同一个对象，则终止
  if (oldVnode === newVnode) return;
  // 如果新旧虚拟节点是文本节点，且文本不一样
  if (
    oldVnode.text !== null &&
    newVnode.text !== null &&
    oldVnode.text !== newVnode.text
  ) {
    // 则直接将真实DOM中文本更新为新虚拟节点的文本
    api.setTextContent(el, newVnode.text);
  } else {
    // 否则

    if (oldCh && newCh && oldCh !== newCh) {
      // 新旧虚拟节点都有子节点，且子节点不一样
      // 对比子节点，并更新
      updateChildren(el, oldCh, newCh);
    } else if (newCh) {
      // 新虚拟节点有子节点，旧虚拟节点没有
      // 创建新虚拟节点的子节点，并更新到真实DOM上去
      createEle(newVnode);
    } else if (oldCh) {
      // 旧虚拟节点有子节点，新虚拟节点没有
      // 直接删除 真实DOM 里对应的子节点
      api.removeChild(el);
    }
  }
}
```

### updateChildren 方法

> 最难理解的部分

双指针 - 新旧 children 都有头尾两个指针

相互进行比较，共`5种情况`，s 为 start，e 为 end

1. `sameNode(oldS, newS)`

2. `sameNode(oldS, newE)`

3. `sameNode(oldE, newS)`

4. `sameNode(oldE, newE)`

5. 如果都不满足的话，把所有 oldCh 的 key 映射到 `key -> index`，再用 newCh 的 key 去寻找可复用的

如果 sameNode 命中的话 左指针要++，右指针--

如果旧的率先走完，说明新比旧的多，要将多出来的节点插入到真实 DOM 对应的位置 -- 遍历？

如果新的率先走完 - 旧的比新的多

```js
// 稍微改动了点 增强可读性
// oS => oldStart, oE => oldEnd
// nS => newStart, nE => newEnd
function updateChildren(parentElm, oldCh, newCh) {
  // 数值初始化
  let oldStartIdx = 0,
    newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1,
    newEndIdx = newCh.length - 1;

  let oldStartVnode = oldCh[0],
    oldEndVnode = oldCh[oldEndIdx];

  let newStartVnode = newCh[0],
    newEndVnode = newCh[newEndIdx];

  let oldKeyToIdx;
  let idxInOld;
  let elmToMove;
  let before;

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {
      // 如果 oldStart 位是 null，oS++
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (oldEndVnode == null) {
      // oldEnd 位 null，oE--
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode == null) {
      // newStart 位 null，nS++
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode == null) {
      // newEnd 位 null，nE--
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // oS === nS ==> patchNode，oS++，nS++
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // oE == nE  ==> patchNode，oE--，nE--
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // oS == nE ==> patchNode, oS++，nE--
      // 在oldEndVnode的下一个兄弟节点前面插入olStartVnode
      patchVnode(oldStartVnode, newEndVnode);
      api.insertBefore(
        parentElm,
        oldStartVnode.el,
        api.nextSibling(oldEndVnode.el)
      );
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // oE == nS ==> patchNode, oE--, nS++
      // 在oldStartVnode的前面插入oldEndVnode
      patchVnode(oldEndVnode, newStartVnode);
      api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // 使用 key 时的比较
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); // 有key生成index表
      }
      idxInOld = oldKeyToIdx[newStartVnode.key];
      if (!idxInOld) {
        api.insertBefore(
          parentElm,
          createEle(newStartVnode).el,
          oldStartVnode.el
        );
        newStartVnode = newCh[++newStartIdx];
      } else {
        elmToMove = oldCh[idxInOld];
        if (elmToMove.sel !== newStartVnode.sel) {
          api.insertBefore(
            parentElm,
            createEle(newStartVnode).el,
            oldStartVnode.el
          );
        } else {
          patchVnode(elmToMove, newStartVnode);
          oldCh[idxInOld] = null;
          api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el);
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
  }
  if (oldStartIdx > oldEndIdx) {
    // 如果oldCh已经遍历完，newCh还有剩 ==> 将剩余newVnode插入
    before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el;
    addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx);
  } else if (newStartIdx > newEndIdx) {
    // newCh遍历完 oldCh还有剩，从oldStart到oldEnd删除节点
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
  }
}
```

## 其他问题

### 为何 v-for 不要用 index 直接做 key

`[a, b, c]` ==> `[aa, a, b, c]`

如果数组头部增加了内容，原来的 key 值都会被+1 ，在 diff 算法过程中，进行`sameNode`对比，0，1，2 都命中 -- 命中的节点进行`patchNode`更新文本，
因为原来没有 key=4 的 c 节点，走新增流程，**所以全部节点都被更新了**

所以，如果用 unique 值去作 key，sameNode 命中，patchNode 也不会去做更新操作，直接复用，所以只有新的 aa 标签会变动被挂载上去，其他标签不会更新

## 参考

[1 - index 作 key](https://juejin.cn/post/6999932053466644517?utm_source=gold_browser_extension)

https://juejin.cn/post/6994959998283907102?utm_source=gold_browser_extension#heading-9

https://blog.shenfq.com/posts/2019/%E8%99%9A%E6%8B%9FDOM%E5%88%B0%E5%BA%95%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F.html
