# Vue queueWatcher()

**Vue 异步更新的方式**

Watcher 的 update 方法的 queueWatcher(this)，将自身推到 watcher 中

```ts
/* 将一个观察者对象 push 进观察者队列，在队列中已经存在相同的 id 则该观察者对象将被跳过，除非它是在队列被刷新时推送 */
export function queueWatcher(watcher: Watcher) {
  /* 获取 watcher 的 id */
  const id = watcher.id;
  /* 检验 id 是否存在，已经存在则直接跳过，不存在则标记哈希表 has，用于下次检验 */
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1;
      while (i >= 0 && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}
```

Watch 实例 update 并不会立即更新视图，push 进一个 queue，queue 处于 waiting 状态，直到下一个 tick 运行的时候将 queue 里的 watcher 全部都执行，这些 watch 实例才会被遍历取出更新视图

id 重复的 watcher 也不会被多次加入到 queue

**所以**同一个 watcher 被多次触发也只会执行一次回调

下一步是[nextTick](/review/vue-next-tick.md)
