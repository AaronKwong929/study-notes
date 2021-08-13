# 小记 Vue 响应式的 Observer, Dep, Watcher

observe 方法 ==> new Observer ==> defineReactive ==> observe 方法递归调用，将数据全部转换成响应式

先实现入口函数 `observe`，对传入的数据进行类型检查，如果是对象类型则将其转成响应式

```js
function observe(data) {
  if (typeof data !== `object`) return;
  new Observer(data);
}
```

然后是实现 `Observer`，将传入的 data 遍历，每一个值进行响应式处理

```js
class Observer {
  constructor(data) {
    this.data = data;
    this.walk();
  }
  walk() {
    Object.keys(this.data).forEach(key => defineReactive(this.data, key));
  }
}
```

然后到了 `defineReactive` 方法，对一个数据进行响应式处理，要创建一个属于这个数据的 `Dep` 类，专门用来收集依赖自己的 `Watcher`

函数开始先对 **value** 执行 `observe`如果是对象，递归创建 observe 检测

这里`Object.defineProperty`将 getter/setter 起个别名 reactiveGetter/reactiveSetter 区分

```js
function defineReactive(data, key, value = data[key]) {
  const dep = new Dep(); // 创建依赖管理
  observe(value); // 如果value是对象，递归调用
  Object.defineProperty(data, key, {
    get: function reactiveGetter() {
      dep.depend(); // 将当前正在读取这个数据的依赖加入dep
      return value;
    },
    set: function reactiveSetter(newValue) {
      if (value === newValue) return;
      value = newValue;
      observe(value); // 更新数据之后也要将新数据转换成响应式的
      dep.notify(); // 通知依赖：数据更新了
    },
  });
}
```

然后是 `Dep` 类，用于管理依赖

```js
class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  notify() {
    this.subs.forEach(sub => sub.update());
  }
  // depend方法，将当前全局环境里的watcher存入depend（单线程，一次只会有一个）
  depend() {
    if (Dep.target) {
      this.subs.push(Dep.target);
    }
  }
}
```

再到 `Watcher` 类

```js
class Watcher {
  constructor(data, expression, callback) {
    this.data = data;
    this.expression = expression;
    this.callback = callback;
    this.value = this.get();
  }
  // 获取值并将自身加入目标的dep里
  get() {
    pushTarget(this); // 将自身加入到全局环境 提供给defineReactive函数加入到依赖管理dep中
    const value = parsePath(this.data, this.expression);
    popTarget(); // 已经完成get值（已加入到目标的依赖管理dep中）
    return value; // 返回该值即可
  }
  // update 方法 类似vm.$watch，有(newValue,oldValue)
  update() {
    const oldValue = this.value;
    this.value = parsePath(this.data, this.expression);
    this.callback.call(this.data, this.value, oldValue);
  }
}
```

## 工具函数

`parsePath` 将给定的数据和路径取值目标

`targetStack` 变量提升到顶部

`pushTarget` 将当前的`Dep.target`存入栈内，取值完成后再弹出

防止父子组件渲染期间，子组件渲染完成后`Dep.target`被改成`null`，导致父组件依赖错误

```js
function parsePath(data, exp) {
  const segments = exp.split(`.`);
  for (const segment of exp) {
    data = data[segment];
  }
  return data;
}

var targetStack = [];

function pushTarget(watcher) {
  targetStack.push(Dep.target); // NOTE: 将活动中的 Dep.target存入栈内
  Dep.target = watcher;
}
function popTarget() {
  Dep.target = targetStack.pop(); // NOTE: 用完之后弹出，恢复上一个Dep.target
}
```

## 然后来测试下

```js
const obj2 = {
  a: 1,
  b: {
    m: {
      n: 4,
    },
  },
};

observe(obj2);

let w1 = new Watcher(obj2, 'a', (val, oldVal) => {
  console.log(`obj.a 从 ${oldVal}(oldVal) 变成了 ${val}(newVal)`);
});
obj2.a = 2;
obj2.a = 3;
obj2.a = 4;
```

### 注意

在`node环境`下，window 是不存在的，将它换成 Dep 类上的一个静态属性即可，这样浏览器/node 环境都通用

完整代码在本目录的`vue-reactive.js`下。

跟随文章学习的具体思路注释在`vue-reactive-steps.js`

参考文章 https://juejin.cn/post/6932659815424458760
