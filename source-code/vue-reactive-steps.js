// function defineReactive(data, key, value = data[key]) {
//     Object.defineProperty(data, key, {
//         get: function reactiveGetter() {
//             console.log(`reactive getter`);
//             return value;
//         },
//         set: function reactiveSetter(newValue) {
//             if (newValue === value) return;
//             console.log(`reactive setter`);
//             value = newValue;
//         },
//     });
// }
// const obj = {};
// defineReactive(obj, `a`, 1);
// console.log(obj.a);
// obj.a = 2;
// console.log(obj.a);

/////////////////////////////////////////////

// // obj 有多个属性？ 新建一个Observer来遍历
// class Observer {
//     constructor(data) {
//         this.data = data;
//         this.walk();
//     }
//     walk() {
//         Object.keys(this.data).forEach((key) => defineReactive(this.data, key));
//     }
// }

// const obj2 = { a: 1, b: 2 };
// new Observer(obj2);
// console.log(obj2.a);

/////////////////////////////////////////////

// obj 有嵌套属性？递归
// 入口方法
function observe(data) {
    // 是对象才劫持
    if (typeof data !== `object`) return;
    new Observer(data);
}
class Observer {
    constructor(data) {
        this.data = data;
        this.walk();
    }
    walk() {
        Object.keys(this.data).forEach((key) => defineReactive(this.data, key));
    }
}
// function defineReactive(data, key, value = data[key]) {
//     observe(value); // 如果 data[key]是个对象（嵌套），则对对象内部进行数据劫持
//     Object.defineProperty(data, key, {
//         get: function reactiveGetter() {
//             console.log(`reactive getter`);
//             return value;
//         },
//         set: function reactiveSetter(newValue) {
//             if (value === newValue) return;
//             console.log(`reactive setter`);
//             value = newValue;
//             observe(value); // 新值也要监听
//         },
//     });
// }

const obj = {
    a: 1,
    b: {
        c: 2,
    },
};
observe(obj);

console.log(obj.a);
console.log(obj.b);
obj.a = { d: 1 };
console.log(obj.a);

//////////////////////////////
// watcher 对应被通知的买家
// class Watcher {
//     constructor(data, exp, cb) {
//         this.data = data;
//         this.exp = exp;
//         this.cb = cb;
//         this.value = this.get(); // 初始化watcher 时订阅数据
//     }
//     get() {
//         const value = parsePath(this.data, this.exp);
//         return value;
//     }
//     update() {
//         // 接收到数据变化的时候执行，刷新数据，执行回调
//         this.value = parsePath(this.data, this.exp);
//         this.cb();
//     }
// }

function parsePath(obj, exp) {
    const segments = exp.split(`.`);
    for (const key of segments) {
        if (!obj) return;
        obj = obj[key];
    }
    return obj;
}

// 每个单独的数据要有一个 dep 来存储依赖自己的watcher
// watcher 实例需要订阅数据
//  watcher 依赖变化时候触发watcher回调
// function defineReactive(data, key, value = data[key]) {
//     const dep = [];
//     observe(data);
//     Object.defineProperty(data, key, {
//         get: function reactiveGetter() {
//             dep.push(watcher); // NOTE: 订阅数据的时候，将依赖这个数据的watcher存入dep
//             return value;
//         },
//         set: function reactiveSetter(newValue) {
//             if (value === newValue) return;
//             value = newValue;
//             observe(value);
//             dep.notify(); // 发布更新通知
//         },
//     });
// }

// 但是上面push进去的watcher 来源不明
// 实例化某个watcher的时候，将它存在全局环境中
// class Watcher {
//     constructor(data, exp, cb) {
//         this.data = data;
//         this.exp = exp;
//         this.cb = cb;
//         this.value = this.get(); // 初始化watcher 时订阅数据
//     }
//     get() {
//         window.target = this; // NOTE: 将当前watcher实例存入全局环境
//         const value = parsePath(this.data, this.exp);
//         window.target = null; // NOTE: 求值完毕后重置target
//         return value;
//     }
//     update() {
//         // 接收到数据变化的时候执行，刷新数据，执行回调
//         const oldValue = this.value;
//         this.value = parsePath(this.data, this.exp);
//         this.cb().call(this.data, this.value, oldValue); // vm.$watch
//     }
// }

// function defineReactive(data, key, value = data[key]) {
//     const dep = [];
//     observe(data);
//     Object.defineProperty(data, key, {
//         get: function reactiveGetter() {
//             dep.push(window.target); // 从 全局环境获得当前正在订阅的watcher
//             return value;
//         },
//         set: function reactiveSetter(newValue) {
//             if (value === newValue) return;
//             value = newValue;
//             observe(value);
//             dep.forEach((d) => d.update());
//         },
//     });
// }

// 将dep抽象成一个类
class Dep {
    constructor() {
        this.subs = [];
    }
    depend() {
        if (window.target) {
            this.subs.push(window.target);
        }
    }
    notify() {
        this.subs.forEach((sub) => sub.update());
    }
    addSub(sub) {
        this.subs.push(sub);
    }
}
// defineReactive修改

function defineReactive(data, key, value = data[key]) {
    const dep = new Dep();
    observe(value); // 如果value是对象，递归调用
    Object.defineProperty(data, key, {
        get: function reactiveGetter() {
            dep.depend(); // 从 全局环境获得当前正在订阅的watcher
            return value;
        },
        set: function reactiveSetter(newValue) {
            if (value === newValue) return;
            value = newValue;
            observe(value);
            dep.notify();
        },
    });
}

//
const targetStack = [];

function pushTarget(_target) {
    targetStack.push(window.target);
    window.target = _target;
}
function popTarget() {
    window.target = targetStack.pop();
}
class Watcher {
    constructor(data, exp, cb) {
        this.data = data;
        this.exp = exp;
        this.cb = cb;
        this.value = this.get(); // 初始化watcher 时订阅数据
    }
    get() {
        // window.target = this; // NOTE: 将当前watcher实例存入全局环境
        pushTarget(this);
        const value = parsePath(this.data, this.exp);
        // window.target = null; // NOTE: 求值完毕后重置target
        popTarget();
        return value;
    }
    update() {
        // 接收到数据变化的时候执行，刷新数据，执行回调
        const oldValue = this.value;
        this.value = parsePath(this.data, this.exp);
        this.cb().call(this.data, this.value, oldValue); // vm.$watch
    }
}

// for test
let obj2 = {
    a: 1,
    b: {
        m: {
            n: 4,
        },
    },
};

observe(obj2);

let w1 = new Watcher(obj2, "a", (val, oldVal) => {
    console.log(`obj.a 从 ${oldVal}(oldVal) 变成了 ${val}(newVal)`);
});
obj2.a = 2;

// w1 实例化的时候 this.get()通过obj2[`a`]去访问了 响应式数据obj的a
// get方法执行第一步将当前这个watcher加入到全局对象中，
// 第二部去 parsePath(obj2, `a`)
// 然后 响应式数据obj2.a的getter可以从全局环境里获得到当前的这个watcher并将它加入
//  - 到obj2.a的 dep 里面
// obj2.a更新的时候 setter会触发dep.notify() 将通知所有依赖的数据：我更新了
// 然后watcher接收到通知，去执行回调

// 调用 observe 将obj 设置成响应式对象
// observe ==> Observer ==> defineReactive ===> observe
// 递归调用将整个数据变成响应式对象

// 渲染页面时实例化 watcher，实例化过程中 watcher把自身放到全局环境
// 获取响应数据时会被响应数据收集依赖 getter依赖
// 依赖变化的时候通知更新回调 setter派发更新 执行回调
