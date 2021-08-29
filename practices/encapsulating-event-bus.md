# 封装 EventBus 的实践

```js
export default class EventBus {
  constructor() {
    this.event = Object.create(null);
  }
  // 注册事件
  $on(name, fn) {
    if (!this.event[name]) {
      // 一个事件可能有多个监听者
      this.event[name] = [];
    }
    this.event[name].push(fn);
  }
  // 触发事件
  $emit(name, ...args) {
    //给回调函数传参
    this.event[name] &&
      this.event[name].forEach(fn => {
        fn(...args);
      });
  }
  // 只被触发一次的事件，触发后删除事件
  $once(name, fn) {
    const cb = (...args) => {
      fn(...args);
      this.off(name, fn);
    };
    this.$on(name, cb);
  }
  // 取消事件
  $off(name, offCb) {
    // 没有制定参数，清除全部
    if (!name && !offCb) {
      this.event = Object.create(null);
      return;
    }
    if (this.event[name]) {
      const index = this.event[name].findIndex(fn =>  fn === offCb);
      this.event[name].splice(index, 1);
      if (!this.event[name].length) delete this.event[name];
    }
  }
}
```

```js
// main.js
Vue.prototype.$Bus = new EventBus();

// xx.vue
this.$Bus.$emit(`abc`, args);
this.$Bus.$on(`abc`, () => {})
```

## 在 Vue3 中使用 EventBus

Vue3 里在 setup 中使用 event bus，因为没有了 this，不能直接使用 this.$Bus.$on /$emit

首先需要在 main.js 里引入 event bus

```js
// src/main.js
import EventBus from '@/utils/event-bus';

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
