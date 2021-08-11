// const obj = {};

// let val = 1;
// Object.defineProperty(obj, `a`, {
//     get() {
//         return val;
//     },
//     set(newVal) {
//         if (val === newVal) return;
//         val = newVal;
//     },
// });

// 上面需哟全局变量来保存这个值

// const obj = {};
// function defineReactive(data, key, value = data[key]) {
//     Object.defineProperty(data, key, {
//         get: function reactiveGetter() {
//             return value;
//         },
//         set: function reactiveSetter(newValue) {
//             if (newValue === value) return;
//             value = newValue;
//         },
//     });
// }
// defineReactive(obj, a, 1);

// 如果obj有多个属性 ===> 建立一个类 Observer来遍历该对象

// class Observer {
//     constructor(value) {
//         this.value = value;
//         this.walk();
//     }
//     walk() {
//         Object.keys(this.value).forEach((key) =>
//             defineReactive(this.value, key)
//         );
//     }
// }
// const obj = { a: 1, b: 1 };
// new Observer(obj);

// obj 有嵌套属性 =====> 递归完成数据劫持
// 入口
function observe(data) {
    if (typeof data !== "object") return;
    new Observer(data);
}

class Observer {
    constructor(value) {
        this.value = value;
        this.walk();
    }
    walk() {
        Object.keys(this.value).forEach((key) =>
            defineReactive(this.value, key)
        );
    }
}

// function defineReactive(data, key, value = data[key]) {
//     //value 对象 ==> 递归Observer
//     // 不是对象 ==>直接返回
//     observe(value);
//     Object.defineProperty(data, key, {
//         get() {
//             return value;
//         },
//         set(newValue) {
//             if (newValue === value) return;
//             value = newValue;
//             observe(value);
//         },
//     });
// }

// Watcher 订阅单个/多个数据，这些数据被称为watcher的依赖
// 当依赖发生变化后，需要执行一个回调函数来实现某些功能
// class Watcher {
//     constructor(data, expression, cb) {
//         // data 数据对象
//         // expression 根据data和expression可以获取watcher依赖的数据
//         // cb 依赖变化时的回调
//         this.data = data;
//         this.expression = expression;
//         this.cb = cb;
//         this.value = this.get(); // 初始化watcher实例时订阅数据
//     }
//     get() {
//         window.target = this; // NOTE: 新增，将这个watcher放到全局环境，提供给defineReactive
//         const value = parsePath(this.data, this.expression);
//         // NOTE: 新增2：求值完毕后重置window.target
//         window.target = null;
//         return value;
//     }
//     update() {
//         // 类似 vm.$watch（watch钩子）接收newValue oldValue
//         const oldValue = this.value;
//         this.value = parsePath(this.data, this.expression);
//         this.cb.call(this.data, this.value, oldValue);
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

// 响应式系统要有一个数组来保存watcher
// watcher实例需要订阅（依赖）数据  ==> 获取依赖/收集依赖 即 获取/收集watcher
// watcher依赖变化时触发watcher回调函数 ==> 派发更新
// 每个响应数据都应该维护一个属于自己的数组，存放依赖自己的watcher，在defineReactive中，
// 定义一个dep 这样么每个reactive属性都能拥有一个属于自己的dep
// function defineReactive(data, key, value = data[key]) {
//     //value 对象 ==> 递归Observer
//     // 不是对象 ==>直接返回
//     const dep = []; // 新增
//     observe(value);
//     Object.defineProperty(data, key, {
//         get: function reactiveGetter() {
//             // 这个watcher函数内获取不到，要在全局里拿
//             // dep.push(watcher);
//             dep.push(window.target); // 从全局环境拿到watcher
//             return value;
//         },
//         set: function reactiveSetter(newValue) {
//             if (newValue === value) return;
//             value = newValue;
//             observe(value);
//             dep.forEach((d) => d.update()); // NOTE: 派发更新
//         },
//     });
// }

// 收集依赖
// 每个响应式数据创建的时候都创建一个属于自己的dep，存放依赖自己的watcher
// 从全局环境里获得到当前需要依赖自己的watcher并存入数组

// 派发更新
// 依赖收集完成之后， 在响应式数据更新的时候要派发更新命令
// 那么就很显然是在defineReactive的setter里通知dep里的watcher了

// 优化代码
// 抽离 Dep

class Dep {
    constructor() {
        this.subs = [];
    }
    depend() {
        if (Dep.target) {
            this.addSub(Dep.target);
        }
    }
    notify() {
        const subs = this.subs.slice();
        subs.forEach((sub) => sub.update());
    }
    addSub(sub) {
        this.subs.push(sub);
    }
}
// 然后defineReactive相应修改

function defineReactive(data, key, value = data[key]) {
    //value 对象 ==> 递归Observer
    // 不是对象 ==>直接返回
    // const dep = [];
    const dep = new Dep();
    observe(value);
    Object.defineProperty(data, key, {
        get: function reactiveGetter() {
            // 这个watcher函数内获取不到，要在全局里拿
            // dep.push(watcher);
            // dep.push(window.target); // 从全局环境拿到watcher
            dep.depend();
            return value;
        },
        set: function reactiveSetter(newValue) {
            if (newValue === value) return;
            value = newValue;
            observe(value);
            dep.forEach((d) => d.update()); // NOTE: 派发更新
        },
    });
}

// 上面window.target 的含义就是 当前执行上下文中的 watcher 实例
// 由于js 单线程的特性，同一时刻只有一个watcher代码在执行，所以不用担心依赖错误
// window.target就是当前在实例化过程中的watcher

// 设想情况 -> 父子组件 ->渲染父组件时实例化父组件watcher，window.target指向父组件
// 然后遇到子组件 -> 渲染子组件，创建子组件watcher window.target指向子组件
// 子组件渲染完成 回到父组件->window.target 变成了 null！
// 所以需要一个栈结构来保存watcher
const targetStack = [];
function pushTarget(_target) {
    targetStack.push(_target);
    window.target = _target;
}
function popTarget() {
    window.target = targetStack.pop();
}

// 对 watcher的get方法修改
class Watcher {
    constructor(data, expression, cb) {
        // data 数据对象
        // expression 根据data和expression可以获取watcher依赖的数据
        // cb 依赖变化时的回调
        this.data = data;
        this.expression = expression;
        this.cb = cb;
        this.value = this.get(); // 初始化watcher实例时订阅数据
    }
    get() {
        // window.target = this; // NOTE: 新增，将这个watcher放到全局环境，提供给defineReactive
        pushTarget(this); // 修改
        const value = parsePath(this.data, this.expression);
        // NOTE: 新增2：求值完毕后重置window.target
        // window.target = null;
        popTarget();
        return value;
    }
    update() {
        // 类似 vm.$watch（watch钩子）接收newValue oldValue
        const oldValue = this.value;
        this.value = parsePath(this.data, this.expression);
        this.cb.call(this.data, this.value, oldValue);
    }
}

// 总结一份

// 注意事项
/**
 * 1. 闭包
 * defineReactive 中形成闭包
 * 每个对象的每个属性都能保留自己的值value 和 依赖对象dep(存放依赖的对象)
 *
 *
 */
