# 对数组进行特殊处理

## 为何

数组是顺序结构，key 和 value 不是绑定的，直接使用原来的监听会导致依赖错乱

## 处理

对`Observer`类进行更改

对数组进行单独的处理，对每一项进行 `observe`

```js
class Observer {
  constructor(data) {
    this.data = data;
    // 对数组进行处理
    if (Array.isArray(data)) observeArray(data);
    else this.walk(data);
  }
  walk(data) {
    Object.keys(data).forEach(key => defineReactive(data, key));
  }
  // 对数组的每一项进行 observe 处理
  observeArray(value) {
    value.forEach(item => observe(item));
  }
}
```

**不能监听数组索引就去监听数组本身**

Vue 对数组的七种方法进行重写

`push pop unshift shift splice reverse sort`

那么在创建 `Observer` 类的时候需要`代理原型`，在数组实例和`Array.prototype`之间增加一层代理实现 派发更新

```js
// Observer.js
class Observer {
  constructor(data) {
    this.data = data;
    // 对数组进行处理
    if (Array.isArray(data)) {
      // NOTE: 这里改变原型
      Object.setPrototypeOf(data, proxyPrototype);
      observeArray(data);
    } else this.walk(data);
  }
  walk(data) {
    Object.keys(data).forEach(key => defineReactive(data, key));
  }
  // 对数组的每一项进行 observe 处理
  observeArray(value) {
    value.forEach(item => observe(item));
  }
}
```

```js
// array.js
const arrayPrototype = Array.prototype; // 缓存真数组原型

// 需要处理的方法
const reactiveMethods = [
  `push`,
  `pop`,
  `shift`,
  `unshift`,
  `sort`,
  `splice`,
  `splice`,
];

// 增加代理原型 proxyPrototype.__proto__ = arrayPrototype
// P.S. 组合寄生继承 可以去看对应笔记
const proxyPrototype = Object.create(arrayPrototype);

// 定义响应式方法
reactiveMethods.forEach(method => {
  const originalMethod = arrayPrototype[method];
  // 在代理原型上定义变异的响应式方法
  Object.defineProperty(proxyPrototype, method, {
    value: function reactiveMethod(...args) {
      const result = originalMethod.apply(this, args);
      // 在这里派发更新
      return result;
    },
    enumerable: false,
    writable: true,
    configurable: true,
  });
});
```

### 如何去派发更新？

对象的话，在`defineReactive`用 `dep.notify()`，拿得到 dep 数组是 getter/setter 形成闭包，保证了每一个响应式属性有自己的 dep

数组的话，如果在原型这里定义一个 dep，那么所有的数组都会共享这个 dep，是不正确的

所以 Vue 在每个对象都增加了一个自定义属性`__ob__`，这个属性用来保存自己的 `Observer`实例，再在 Observer 上增加一个 dep

### 对`observe`方法进行修改

修改 observe 方法，增加一个 `ob`

首先判断目标值上有没有这个`__ob__`属性，以及这个`__ob__`是不是`Observer`的实例

如果是，将它赋值给`ob`，不做任何操作

如果不是，则对`value`进行 `new Observer(value)`

```js
// observe.js
function observe(value) {
  if (typeof value !== `object`) return;
  let ob;
  if (value.__ob__ && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }
  return ob;
}
```

`Observer` 也要进行修改 ==> 这里是有个返回值的

1. 在 Observer 这里创建一个 Dep

2. 在每一个对象上定义一个`__ob__`，指向这个 Observer 实例

```js
// Observer.js
class Observer {
  constructor(data) {
    this.data = data;

    this.dep = new Dep();

    def(value, `__ob__`, this);

    // 对数组进行处理
    if (Array.isArray(data)) {
      // NOTE: 这里改变原型
      Object.setPrototypeOf(data, proxyPrototype);
      observeArray(data);
    } else this.walk(data);
  }
  walk(data) {
    Object.keys(data).forEach(key => defineReactive(data, key));
  }
  // 对数组的每一项进行 observe 处理
  observeArray(value) {
    value.forEach(item => observe(item));
  }
}
```

工具函数`def` ==> 对 Object.defineProperty 的封装

```js
function def(obj, key, value, enumerable = false) {
  Object.defineProperty(obj, key, {
    value,
    enumerable,
    configurable: true,
    writable: true,
  });
}
```

这样的话，对象 `obj: { arr: [] }` ===> `obj: { arr: [..., __ob__: {}], __ob__: {}}`

那么，现在可以访问到 `Observer` 实例，`派发更新`就可以实现了

push, unshift, splice 是会对数组增加内容的，这些内容也需要被监听

splice 3+参数才是新增的元素

```js
// array.js
reactiveMethods.forEach(method => {
  const originalMethod = arrayPrototype[method];
  // 在代理原型上定义变异的响应式方法
  Object.defineProperty(proxyPrototype, method, {
    value: function reactiveMethod(...args) {
      const result = originalMethod.apply(this, args);

      const ob = this.__ob__;

      let inserted = null;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
      }
      if (inserted) ob.observeArray(inserted);

      ob.dep.notify();

      return result;
    },
    enumerable: false,
    writable: true,
    configurable: true,
  });
});
```

## 依赖收集

每个属性的 getter/setter 通过闭包保存了自己的 dep，dep 收集了依赖自己的 watcher，闭包中还能访问到 childOb， childOb.dep 也保存了依赖自己的 watcher，
两个属性值保存的 watcher 相同

```js
// defineReactive.js
function defineReactive(data, key, value = data[key]) {
  const dep = new Dep(); // 创建依赖管理

  let childOb = observe(value); // NOTE: observe现在会返回__ob__

  Object.defineProperty(data, key, {
    get: function reactiveGetter() {
      dep.depend(); // 将当前正在读取这个数据的依赖加入dep

      // 如果有childOb 那么就要将它加入到依赖环境中
      // 基本类型值没有 childOb ，observe函数直接return了
      if (childOb) {
        childOb.dep.depend();
      }

      return value;
    },
    set: function reactiveSetter(newValue) {
      if (value === newValue) return;
      value = newValue;
      childOb = observe(value); // 对新的内容转响应式，也会返回__ob__
      dep.notify(); // 通知依赖：数据更新了
    },
  });
}
```

### 依赖数组就等于依赖了数组中的所有元素

```js
// defineReactive.js
function defineReactive(data, key, value = data[key]) {
  const dep = new Dep(); // 创建依赖管理

  let childOb = observe(value); // NOTE: observe现在会返回__ob__

  Object.defineProperty(data, key, {
    get: function reactiveGetter() {
      dep.depend(); // 将当前正在读取这个数据的依赖加入dep

      // 如果有childOb 那么就要将它加入到依赖环境中
      // 基本类型值没有 childOb ，observe函数直接return了
      if (childOb) {
        childOb.dep.depend();

        if (Array.isArray(val)) {
          dependArray(val);
        }
      }

      return value;
    },
    set: function reactiveSetter(newValue) {
      if (value === newValue) return;
      value = newValue;
      childOb = observe(value); // 对新的内容转响应式，也会返回__ob__
      dep.notify(); // 通知依赖：数据更新了
    },
  });
}

function dependArray(array) {
  for (let e of array) {
    e && e.__ob__ && e.__ob__.dep.depend();

    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}
```

如果 val 是一个数组的话，那么就要对它里面的所有值都进行依赖收集

如果里面的值也是数组，那么也要递归收集依赖

## 完整的

```js
// observe.js
function observe(value) {
  if (typeof value !== `object`) return;
  let ob;
  if (value.__ob__ && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }
  return ob;
}

// Observer.js
class Observer {
  constructor(data) {
    this.data = data;

    this.dep = new Dep();

    def(value, `__ob__`, this);

    // 对数组进行处理
    if (Array.isArray(data)) {
      // NOTE: 这里改变原型
      Object.setPrototypeOf(data, proxyPrototype);
      observeArray(data);
    } else this.walk(data);
  }
  walk(data) {
    Object.keys(data).forEach(key => defineReactive(data, key));
  }
  // 对数组的每一项进行 observe 处理
  observeArray(value) {
    value.forEach(item => observe(item));
  }
}

function def(obj, key, value, enumerable = false) {
  Object.defineProperty(obj, key, {
    value,
    enumerable,
    configurable: true,
    writable: true,
  });
}

// defineReactive.js
function defineReactive(data, key, value = data[key]) {
  const dep = new Dep(); // 创建依赖管理

  let childOb = observe(value); // NOTE: observe现在会返回__ob__

  Object.defineProperty(data, key, {
    get: function reactiveGetter() {
      dep.depend(); // 将当前正在读取这个数据的依赖加入dep

      // 如果有childOb 那么就要将它加入到依赖环境中
      // 基本类型值没有 childOb ，observe函数直接return了
      if (childOb) {
        childOb.dep.depend();

        if (Array.isArray(val)) {
          dependArray(val);
        }
      }

      return value;
    },
    set: function reactiveSetter(newValue) {
      if (value === newValue) return;
      value = newValue;
      childOb = observe(value); // 对新的内容转响应式，也会返回__ob__
      dep.notify(); // 通知依赖：数据更新了
    },
  });
}

function dependArray(array) {
  for (let e of array) {
    e && e.__ob__ && e.__ob__.dep.depend();

    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}
```
