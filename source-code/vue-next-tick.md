# Vue nextTick

在下次 DOM 更新结束后执行回调 ==> 可以 access 到最新的 DOM

nextTick 源码

```js
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    if (isIOS) setTimeout(noop);
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== 'undefined' &&
  (isNative(MutationObserver) ||
    MutationObserver.toString() === '[object MutationObserverConstructor]')
) {
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}
```

一句话：Promise **一路降级**，两个微任务，两个宏任务

1. `Promise` => Promise.resolve().then()，针对 iOS 还需要增加一个 setTimeout noop（noop vue 工具函数 - 空函数）

2. `MutationObserver`

3. `setImmediate`

4. `setTimeout`

## 异步更新原理

dep.notify()通知 watcher 进行更新操作

依次调用 watcher 的 update() ==> subs[i].update()

将 watcher 去重，放入 `queueWatcher`中

异步清空 watcher 队列

update 方法

```js
update () {
    /* istanbul ignore else */
    if (this.lazy) { // 计算属性  依赖的数据发生变化了 会让计算属性的watcher的dirty变成true
      this.dirty = true
    } else if (this.sync) { // 同步watcher
      this.run()
    } else {
      queueWatcher(this) // 将要更新的 watcher 放入队列
    }
}
```

queueWatcher 方法

```js
export function queueWatcher(watcher: Watcher) {
  const id = watcher.id; // 过滤 watcher，多个data属性依赖同一个watcher ，一个组件只有一个watcher
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher); // 将watcher放到队列中
    } else {
      // 通过对 id 的判断，这里的 id 是自加1，可查看 watcher.js 源码，
      // 如果已经刷新了，则赋值当前的id , 如果id超过了，将运行如下代码
      let i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      // 如果不等了，则进行刷新
      waiting = true;

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue(); // 该方法做了刷新前的 beforeUpdate 方法调用，然后 watcher.run()
        return;
      }
      nextTick(flushSchedulerQueue); // 在下一次tick中刷新 watcher 队列 （借用nextTick）
      //（包含同一watcher的多个data属性），
      // 这里的nextTick 就是我们的常用api => this.$nextTick()
    }
  }
}
```

## 为什么一定能拿到最新的 DOM?

nextTick 放在赋值后面异步更新视图后才会将 nextTick 入队，能拿到最新的 DOM

## 为什么要异步更新视图？

Vue2 组件级更新，如果每赋值一次都触发一次同步更新，性能会爆炸。

异步更新的意思是：等本轮数据更新完成后再异步进行视图更新

来看文档

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210820223700.png)
