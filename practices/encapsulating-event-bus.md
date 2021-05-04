# 封装 EventBus 的实践

```js
export default class EventBus {
    constructor() {
        this.event = Object.create(null);
    }
    // 注册事件
    $on(name, fn) {
        if (!this.event[name]) {
            //一个事件可能有多个监听者
            this.event[name] = [];
        }
        this.event[name].push(fn); // note: 添加订阅
    }
    // 触发事件
    $emit(name, ...args) {
        //给回调函数传参
        this.event[name] &&
            this.event[name].forEach((fn) => {
                fn(...args); // note: 发布
            });
    }
    // 只被触发一次的事件
    $once(name, fn) {
        //在这里同时完成了对该事件的注册、对该事件的触发，并在最后取消该事件。
        const cb = (...args) => {
            //触发
            fn(...args);
            //取消
            this.off(name, fn);
        };
        //监听
        this.$on(name, cb);
    }
    // 取消事件
    $off(name, offcb) {
        if (!name && !offcb) {
            this.event = Object.create(null);
            return;
        }
        if (this.event[name]) {
            let index = this.event[name].findIndex((fn) => {
                return offcb === fn;
            });
            this.event[name].splice(index, 1);
            if (!this.event[name].length) {
                delete this.event[name];
            }
        }
    }
}
```

## 在 Vue3 中使用 EventBus

Vue3 里在 setup 中使用 event bus，因为没有了 this，不能直接使用 this.$Bus.$on /$emit

首先需要在 main.js 里引入 event bus

```js
// src/main.js
import EventBus from "@/utils/event-bus";

const $bus = new EventBus();

//...

app.provide(`$bus`, $bus);
```

然后在各个需要 event-bus 的 vue 文件里

```js
import {inject} from 'vue'

// ...
setup() {
    const $bus = inject(`$bus`);
    onBeforeUnmount(() => {
        $bus.$off(`xxxx`);
    })
}
```