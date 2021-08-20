# Vue nextTick

在下次 DOM 更新结束后执行回调 ==> 可以 access 到最新的 DOM

nextTick 源码

```js
// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop);
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== 'undefined' &&
  (isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]')
) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
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
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
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

条件判断 ==> 支持`Promise`就使用 Promise.resolve().then()，针对某些 iOS 版本还需要增加一个 setTimeout noOP

不支持 Promise 的话检查`MutationObserver`

再不支持的话使用`setImmediate`（但是这个东西只有最新的 ie 和 node 支持）(这里为什么不用 MutationEvent？)

如果都不支持就使用 setTimeout

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
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
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
        flushSchedulerQueue(); // 该方法做了刷新前的 beforUpdate 方法调用，然后 watcher.run()
        return;
      }
      nextTick(flushSchedulerQueue); // 在下一次tick中刷新 watcher 队列 （借用nextTick）
      //（包含同一watcher的多个data属性），
      // 这里的nextTick 就是我们的常用api => this.$nextTick()
    }
  }
}
```

这是关于 EventLoop

![](https://raw.githubusercontent.com/AaronKwong929/pictures/master/20210820211323.png)

## 为什么一定能拿到最新的 DOM?

## 为什么要异步更新视图？

Vue2 组件级更新，如果每赋值一次都触发一次同步更新，性能会爆炸。

异步更新的意思是：等本轮数据更新

来看文档

![](https://raw.githubusercontent.com/AaronKwong929/pictures/master/20210820223700.png)

## 怎么理解 nextTick 队列 watcher 的顺序

## 调用 nextTick 的队列？
