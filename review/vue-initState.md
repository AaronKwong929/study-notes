```js
function initState(vm) {
    vm._watchers = [];
    const opts = vm.$options;

    if (opts.props) initProps(vm, opt.props);
    if (opts.methods) initProps(vm, opt.methods);
    if (opts.data) initData(vm, opt.data);
    else observe((vm._data = {}), true /* asRootData */); // 如果没有data设置一个响应式空对象
    if (opts.computed) initComputed(vm, opts.computed);
    if (opts.watch && opts.watch.watch !== nativeWatch)
        initWatch(vm, opts.watch);
}
```

```js
function initProps(vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var loop = function (key) {
        defineReactive(props, key, value, cb); // 响应式
        if (!(key in vm)) {
            proxy(vm, `_props`, key); // 通过vm[key]访问
        }
    };
    for (var key in propsData) {
        loop(key);
    }
}
```

```js
// 必须是function；不与props重名；不是预留开头
function initMethods(vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
        if (typeof methods[key] !== "function") warn();

        if (props && hasOwn(props, key)) warn();

        if (key in vm && isReserverd(key)) warn();

        // 直接挂在到 vm 通过vm.method访问
        vm[key] =
            typeof methods[key] !== "function" ? noop : bind(methods[key], vm);
    }
}
```

```js
function initData(vm) {
    var data = vm.$options.data;
    // 根实例：data是对象，子组件data是函数，getData会调用函数返回data对象
    data = vm._data =
        typeof data === "function" ? getData(data, vm) : data || {};

    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
        var key = keys[i];
        // 命名不能和方法重复
        if (methods && hasOwn(methods, key)) warn();

        // 命名不能和props重复
        if (props && hasOwn(props, key)) warn();
        else if (!isReversed(key)) {
            // 代理访问 vm[key] vm._data[key]
            proxy(vm, "_data", key);
        }
    }

    observe(data, true /* asRootData */);
}
```
