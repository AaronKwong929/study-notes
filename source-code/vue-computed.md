# computed 原理小记

> 它是怎么缓存响应式数据的

`initComputed`方法里创建 computed watcher，对目标 data 进行依赖，会设置`{ lazy: true }`，这是 computed watcher 的标记

这个方法里最终使用`defineComputed`，里面使用`Object.defineProperty`进行响应式处理，这个过程可参考`响应式原理`

当访问到`computed`属性的时候，触发 getter 进行依赖收集，

这时候判断如果 dirty 为 true，那么就要进行 evaluate，然后将它加入依赖

evaluate 其实就是`this.get();`，然后把 dirty 设置成 false（即干净值 不需要再更新）

```js
function createComputedGetter(key) {
  return function computedGetter() {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}
```

```js
Watcher.prototype.evaluate = function evaluate() {
  // evaluate 的作用是执行计算回调，并标记值不需更新
  this.value = this.get();
  this.dirty = false;
};
```

```js
Watcher.prototype.update = function update() {
  // 计算属性分支
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};
```

在响应式数据变更派发更新的时候`dep.notify()`，判断这个 watcher 是不是 computed watcher 如果是就只把 dirty 改成 true

由于 data 数据拥有渲染 watcher 这个依赖，所以同时会执行 updateComponent 进行视图重新渲染，而 render 过程中会访问到计算属性，此时由于 this.dirty 值为 true，又会对计算属性重新求值。
