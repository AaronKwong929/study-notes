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
