function observe(data) {
  if (typeof data !== `object`) return;
  new Observer(data);
}

class Observer {
  constructor(data) {
    this.data = data;
    this.walk();
  }
  walk() {
    Object.keys(this.data).forEach(key => defineReactive(this.data, key));
  }
}

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

function parsePath(data, exp) {
  const segments = exp.split(`.`);
  for (const segment of segments) {
    data = data[segment];
  }
  return data;
}
var targetStack = [];

function pushTarget(watcher) {
  targetStack.push(Dep.target);
  Dep.target = watcher;
}

function popTarget() {
  Dep.target = targetStack.pop();
}

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
