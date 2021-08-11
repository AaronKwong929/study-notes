# 怎么样通过调试去看 Vue 源码

> 这是一篇源码学习前置文章，讲一下要大概怎么样去配置调试来看 Vue 源码

```cmd
vue create vue2
```

只选择 babel 其他都不选了

安装----->

进入工程目录，打开`main.js`

将`import Vue from 'vue';`改为`import Vue from '../node_modules/vue/dist/vue'`

然后对 new Vue 打断点（左侧行号前）

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210811134227.png)

然后可以直接在`package.json`的这个地方

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210811134329.png)

或者 直接在终端 `yarn serve`

即可开始愉快的调试之旅

P.S. 将`App.vue`里的无关内容都干掉，只留最简单的部分

```html
<template>
  <div id="app">{{ msg }}</div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        msg: `aaa`,
      };
    },
  };
</script>
```
