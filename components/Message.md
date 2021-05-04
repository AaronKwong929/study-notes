# 仿 Element-UI 的 Message

## 完整代码

```js
import Vue from "vue";
import component from "./Message.vue";
const Constructor = Vue.extend(component);
let instance;

const Message = function (options = {}) {
  instance = new Constructor({
    data: options, // 这里的 data 会传到 main.vue 组件中的 data 中，当然也可以写在 props 里
  });
  document.body.appendChild(instance.$mount().$el);
};

["success", "error", "info", "warning", "stop"].forEach((type) => {
  Message[type] = (options) => {
    options.type = type;
    return Message(options);
  };
});

export default Message;
```

```html
<template>
  <transition name="fade">
    <div class="admin_message" :class="type" v-show="show" :style="offsetTop">
      <i :class="getTypeMap" />
      <span>{{ content }}</span>
    </div>
  </transition>
</template>
<script>
  export default {
    name: "Toast",
    data() {
      return {
        content: "",
        duration: 3000,
        type: "",
        show: false,
        typeMap: Object.freeze({
          success: `success`,
          error: `error`,
          info: `info`,
          stop: `remove`,
          warning: `warning`,
        }),
      };
    },
    computed: {
      getTypeMap() {
        const type = this.typeMap[this.type];
        return `icon el-icon-${type}`;
      },
      offsetTop() {
        const target = document.getElementsByClassName(`admin_message`),
          length = target.length;
        if (length > 0) {
          const offsetTop = target[length - 1].style.getPropertyValue(`top`);
          return `top: ${parseFloat(offsetTop) + 70}px`;
        }

        return `top: 40px`;
      },
    },
    mounted() {
      this.show = true;
      setTimeout(
        () => {
          this.show = false;
          setTimeout(() => {
            this.$destroy(true);
            this.$el.parentNode.removeChild(this.$el);
          }, 300);
        },
        this.duration > 0 ? this.duration : 3000
      );
    },
  };
</script>

<style lang="scss" scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .admin_message {
    position: fixed;
    top: 40px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);

    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 18px;

    min-width: 360px;
    height: 60px;
    padding: 10px 20px;
    background: white;
    box-shadow: 0px 4px 10px 0px rgba(187, 187, 187, 0.5);
    border-radius: 6px;
    z-index: 1000;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    & .icon {
      margin-right: 10px;
    }

    &.info {
      color: #999;
    }

    &.stop {
      color: #999;
    }

    &.success {
      color: #7ad673;
    }

    &.warning {
      color: #e6a23c;
    }

    &.error {
      color: #ff6951;
    }
  }
</style>
```
