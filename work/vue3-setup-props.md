# Vue3 父子组件数据传递记录

1. 首先在父组件写入以下内容

```html
<!-- 更改 modalValue 为 visible -->
<dialog v-model:visible="visible" />
```

```js
const visible = ref(false);
// 点击按钮时打开面板
const handleClick = () => {
  visible.value = true;
};

return {
  // ...
  visible,
  handleClick,
};
```

2. 子组件接收 props

按照[官方文档](https://v3.cn.vuejs.org/guide/composition-api-setup.html#props)的步骤：

![step](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210421192716.png)

```js
export default {
  // 需要写 props 接收 visible
  props: {
    visible: {
      type: Boolean,
    },
  },

  // emit 到父组件的事件
  emits: [`update:visible`],

  setup(props, { emit }) {
    const { visible } = toRefs(props);
    watch(visible, (val) => {
      show.value = val;
    });

    // 创建一个以 visible 原值为初始值的 show
    const show = ref(visible.value);
    watch(show, (val) => {
      emit(`update:visible`, val);
    });

    return {
      // ！！！！这里不要return visible  不然会报 duplicate-key 错误
      show,
    };
  },
};
```

上面的操作其实大概等价于下面（封装层）的操作（不太恰当）

```vue
<template>
  <!-- el-input 相当于第三层 -->
  <el-input v-model="data" />
</template>

<script>
export default {
  data() {
    data: this.visible;
  },

  watch: {
    value(val) {
      this.data = val;
    },

    data(val) {
      this.$emit(`update:value`, val);
    },
  },
};
</script>
```
