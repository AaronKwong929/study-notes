class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  depend() {
    if (Dep.target) {
      this.subs.push(Dep.target);
    }
  }
  notify() {
    this.subs.forEach(sub => sub.update());
  }
}

const targetStack = [];
function pushTarget(watcher) {
  targetStack.push(Dep.target);
  Dep.target = watcher;
}
function popTarget() {
  Dep.target = targetStack.pop();
}
function parsePath(data, exp) {
  const segments = exp.split(`.`);
  for (const seg of segments) {
    data = data[seg];
  }
  return data;
}

class Watcher {
  constructor(obj, exp, cb) {
    this.obj = obj;
    this.exp = exp;
    this.cb = cb;
    this.value = this.target();
  }
  get() {
    pushTarget(this);
    const value = parsePath(this.obj, this.exp);
    popTarget();
    return value;
  }
  update() {
    const oldValue = this.value;
    this.value = parsePath(this.obj, this.exp);
    this.cb.call(this.data, this.value, oldValue);
  }
}

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
const arrayPrototype = Array.prototype;
const reactiveMethods = [
  `push`,
  `pop`,
  `shift`,
  `unshift`,
  `sort`,
  `splice`,
  `splice`,
];
const proxyPrototype = Object.create(arrayPrototype);
reactiveMethods.forEach(method => {
  const originalMethod = arrayPrototype[method];
  Object.defineProperty(proxyPrototype, method, {
    value: function (...args) {
      const res = originalMethod.apply(this, args);
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
      return res;
    },
  });
});
class Observer {
  constructor(data) {
    this.data = data;
    this.dep = new Dep();
    def(value, `__ob__`, this);
    if (Array.isArray(value)) {
      Object.setPrototypeOf(data, proxyPrototype);
      observeArray(value);
    } else {
      this.walk();
    }
  }
  walk() {
    Object.keys(this.data).forEach(key => defineReactive(this.data, key));
  }
  observeArray(value) {
    value.forEach(val => observe(val));
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
function defineReactive(data, key, value = data[key]) {
  const dep = new Dep();
  let childOb = observe(value);
  Object.defineProperty(data, key, {
    get: function () {
      dep.depend();
      if (childOb) {
        childOb.dep.depend();
        if (Array.isArray(value)) dependArray(value);
      }
      return value;
    },
    set: function (val) {
      if (value === val) return;
      value = val;
      childOb = observe(value);
      dep.notify();
    },
  });
}
function dependArray(list) {
  for (const e of list) {
    e && e.__ob__ && e.__ob__.depend();
    if (Array.isArray(e)) dependArray(e);
  }
}
