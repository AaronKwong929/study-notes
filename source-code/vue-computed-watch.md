# Vue 中的 computed 和 watch

## computed

computed 是计算属性，根据所依赖的数据展示新的计算结果

computed 的值在 getter 执行后会被缓存，只有依赖变化才会重新执行

缓存优化性能，避免每次调用都计算一次，造成性能开销

## watch

immediate 属性：**不是**将回调改成同步执行，是第一次加载的时候会执行这个方法

deep 属性：深度监听对象值，给对象所有值加上这个监听，除非有必要不要用，开销大

## 异同

同：都是监听页面变化

异：computed 在依赖不改变时会缓存；watch 每次都会执行函数，更适合异步操作

## computed 实现原理

```js
if (opts.computed) initComputed(vm, opts.computed);
```

```ts
const computedWatcherOptions = { lazy: true };
function initComputed(vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = (vm._computedWatchers = Object.create(null));
  // computed properties are just getters during SSR
  const isSSR = isServerRendering();

  for (const key in computed) {
    const userDef = computed[key];
    const getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(`Getter is missing for computed property "${key}".`, vm);
    }
    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }
    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(
          `The computed property "${key}" is already defined as a prop.`,
          vm
        );
      }
    }
  }
}
```

首先使用`Object.create(null)`创建一个空对象，赋值给`watcher`和`vm._computedWatchers`

然后 `const isSSR = isServerRendering();` 判断是不是服务端渲染

然后 `for in`，取到 computed 里的每一个值，判断是对象还是函数

是函数的话 getter 返回自身，否则取到对象的 get 作为 getter

`const getter = typeof userDef === 'function' ? userDef : userDef.get;`

判断 getter 是否存在

如果非服务端渲染下，直接 `new Watcher` 可以知道，computed 是 watcher 的实例

`Watcher`在`vue/src/core/observer/watcher.js`，是响应式原理的部分

继续往下，如果 key 没有在 vm 中，要通过`defineComputed`挂载，

// https://www.cnblogs.com/tugenhua0707/p/11760466.html

暂时先记到这里
