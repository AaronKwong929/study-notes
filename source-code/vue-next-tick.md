# Vue nextTick 原理小记

`queueWatcher`

回调函数都被存到 callbacks 数组里

flushCallbacks 是将回调队列里的所有回调都执行掉

```ts
let callbacks = []; // 回调函数
let pending = false;
const callbacks = [];/*存放异步执行的回调*/
/*一个标记位，如果已经有timerFunc被推送到任务队列中去则不需要重复推送*/
let pending = false;
/*一个函数指针，指向函数将被推送到任务队列中，等到主线程任务执行完时，任务队列中的timerFunc被调用*/
let timerFunc;

export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;
  // 第一步 传入的cb会被push进callbacks中存放起来
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  // 检查上一个异步任务队列（即名为callbacks的任务数组）是否派发和执行完毕了。pending此处相当于一个锁
  if (!pending) {
    // 若上一个异步任务队列已经执行完毕，则将pending设定为true（把锁锁上）
    pending = true;
    // 调用判断Promise，MutationObserver，setTimeout的优先级
    timerFunc();
  }
  // 第三步执行返回的状态
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve;
    });
  }
}

function flushCallbacks() {
  pending = false; // 把标志还原为false
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]();
  }
}
```

`timerFunc` 内部实现，不断降级判断

```js
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    if (isIOS) setTimeout(noop); // 针对iOS系统需要加一个setTimeout 空函数
    // iOS 不能正确中断Promise.resolve()
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
    } else if (this.sync) { // 同步 watcher，立刻更新视图
      this.run()
    } else {
      queueWatcher(this) // 将要更新的 watcher 放入队列
    }
}
```

`queueWatcher` 方法

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

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210820223700.png)
