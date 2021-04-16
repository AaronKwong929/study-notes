# 关于 Element-UI 遇到的问题记录

## 关于按需引入 MessageBox 等

注意 Message.confirm，不然实际使用时，this.$confirm(content,title,option)里的 option 会无效

```js
import { MessageBox, Message } from "element-ui";
Message.install = function (Vue, options) {
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$message = Message;
};
```

## 关于 指令 v-loading.fullscreen.lock

不需要在每个路由页面写一次，每个地方分别创建指令，

用 eventBus 的方法，在 App.vue 里做一个事件监听

```js
initEventBus() {
      this.$Bus.$on(`lock-screen`, lock => {
        this.fullscreenLoading = lock;
      });
      this.$once(`hook:beforeDestroy`, () => {
        this.$Bus.$off(`lock-screen`);
      });
    }
```

在各个需要用到 lock 的地方直接 emit 事件改编 lock 状态即可

```js
this.$Bus.$emit(`lock-screen`, true);
```

避免多个路由页面都写 v-loading.fullscreen.lock 每个都单独维护

## 关于el-menu 嵌套路由情况下返回父级路由路由 按钮不高亮的问题