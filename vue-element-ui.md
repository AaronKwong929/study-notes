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

## 关于 el-menu 嵌套路由情况下返回父级路由路由 按钮不高亮的问题

平时写 el-menu 使用 router 模式是这样的

```html
<template>
    <el-menu router :default-active="$route.path" class="el-menu-vertical">
        <el-menu-item index="/router1">
            <i class="el-icon-xxx" />
            <span slot="title">路由1</span>
        </el-menu-item>

        <el-menu-item index="/router2">
            <i class="el-icon-xxx" />
            <span slot="title">路由2</span>
        </el-menu-item>
    </el-menu>
</template>
```

使用了 default-active 监听当前路由的 path，可以在用户主动 F5 刷新的情况下保持页面刷新后 el-menu 还是高亮对应路由

到这一步是没有问题的，然而在做业务的时候发现了以下问题

当前路由是嵌套的，配置如下

```js
{
    path: '/router1',
    component: () =>
      import('@/views/router1/index.vue'),
    children: [
      {
        path: ``,
        name: 'router1son1',
        component: () =>
          import('@/views/router1/router1-son1.vue'),
      },
      {
        path: `son2`,
        name: 'router1son2',
        component: () =>
          import(
             '@/views/router1/router1-son2.vue'
          ),
      },
    ],
  },
```

子路由 1 直接采用父级空路径

在子路由 2 返回上级（即渲染的内容是子路由 1）的情况下，el-menu 高亮失效了

↑ 在切换到其他一级路由再切换回该路由的时候 el-menu 高亮恢复

这是因为 :default-active="$route.path" 这里，el-menu-item 的 index 是/router1；而从子路由返回一级路由后当前的路由路径是 /router1/ **没有和 index 匹配到**，所以高亮失效

解决办法：

加一个计算属性，匹配当前 $route.path 和 `${$route.path}`/ 

```js
computed: {
    activeRoute() {
      // 解决嵌套路由返回父级空路径路由时，sidebar不高亮的问题
      const { path } = this.$route;
      return path.endsWith(`/`) ? path.substring(0, path.length - 1) : path;
    },
  },
```

完美解决上述问题