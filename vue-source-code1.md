# 记一下看源码时候的想法

new Vue ->

```js
function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}
```

这里的\_init

```js
function initMixin(Vue) {
  // // //   Vue.prototype._init = function (options) {
  // // //     var vm = this;
  // // //     // a uid
  // // //     vm._uid = uid$3++;

  // // //     var startTag, endTag;
  // // //     /* istanbul ignore if */
  // // //     if (process.env.NODE_ENV !== "production" && config.performance && mark) {
  // // //       startTag = "vue-perf-start:" + vm._uid;
  // // //       endTag = "vue-perf-end:" + vm._uid;
  // // //       mark(startTag);
  // // //     }

  // // //     // a flag to avoid this being observed
  // // //     vm._isVue = true;
  // // //     // merge options
  // // //     if (options && options._isComponent) {
  // // //       // optimize internal component instantiation
  // // //       // since dynamic options merging is pretty slow, and none of the
  // // //       // internal component options needs special treatment.
  // // //       initInternalComponent(vm, options);
  // // //     } else {
  // // //       vm.$options = mergeOptions(
  // // //         resolveConstructorOptions(vm.constructor),
  // // //         options || {},
  // // //         vm
  // // //       );
  // // //     }
  // // //     /* istanbul ignore else */
  // // //     if (process.env.NODE_ENV !== "production") {
  // // //       initProxy(vm);
  // // //     } else {
  // // //       vm._renderProxy = vm;
  // // //     }
  // expose real self
  vm._self = vm;
  initLifecycle(vm);
  initEvents(vm);
  initRender(vm);
  callHook(vm, "beforeCreate");
  initInjections(vm); // resolve injections before data/props
  initState(vm);
  initProvide(vm); // resolve provide after data/props
  callHook(vm, "created");

  // // //     /* istanbul ignore if */
  // // //     if (process.env.NODE_ENV !== "production" && config.performance && mark) {
  // // //       vm._name = formatComponentName(vm, false);
  // // //       mark(endTag);
  // // //       measure("vue " + vm._name + " init", startTag, endTag);
  // // //     }

  // // //     if (vm.$options.el) {
  // // //       vm.$mount(vm.$options.el);
  // // //     }
  // // //   };
}
```

\_init 做了的事情：

initLifeCycle -> 生命周期初始化
initEvents -> 还没看到
initRender -> 还没看到
callHook(vm, "beforeCreate") -> 执行 befroeCreate 生命周期里
initInjections -> 初始化 inject
initState -> 初始化 props data computed methods watch (有顺序，要具体看 initState)
initProvide -> 初始化 provide
callHook(vm, "created") -> 执行 created 生命周期

在 beforeCreate 和 created 之间进行的数据初始化，先初始化 inject 再去初始化 state（包含很多东西）再去初始化 provide
