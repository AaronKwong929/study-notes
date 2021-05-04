# Toast 轻提示组件

## 使用方式

## 完整代码

```js
import toastComponent from "./Toast.vue";
export default function (vue) {
  const Constructor = vue.extend(toastComponent);
  const Instance = new Constructor();
  let timeout1;
  let timeout2;
  Instance.$mount();
  document.body.appendChild(Instance.$el);
  vue.prototype.$toast = (text, duration = 3000) => {
    Instance.position = "50%";
    Instance.text = text;
    Instance.showWrap = true; // 是否显示组件
    Instance.showContent = true; // 作用:在隐藏组件之前,显示隐藏动画
    // 提前 250ms 执行淡出动画(因为我们再css里面设置的隐藏动画持续是250ms)
    clearTimeout(timeout1);
    timeout1 = setTimeout(() => {
      Instance.showContent = false;
    }, duration - 1250);
    // 过了 duration 时间后隐藏整个组件
    clearTimeout(timeout2);
    timeout2 = setTimeout(() => {
      Instance.showWrap = false;
    }, duration);
  };
}
```

```html
<template>
  <div
    class="wrap"
    v-if="showWrap"
    :style="'left:' + position + ';'"
    :class="showContent ? 'fadein' : 'fadeout'"
  >
    {{ text }}
  </div>
</template>
<script>
  export default {
    name: "Toast",
    data() {
      return {
        showWrap: false,
        showContent: false,
        position: "",
      };
    },
  };
</script>
<style scoped>
  .wrap {
    position: fixed;
    left: 50%;
    top: 45%;
    white-space: nowrap;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.4);
    padding: 5px 10px;
    transform: translate(-50%, -50%);
    color: #fff;
    font-family: Microsoft YaHei;
    font-weight: 400;
    text-align: center;
    line-height: 30px;
    font-size: 12px;
    border-radius: 5px;
  }
  .fadein {
    animation: animate_in 0.25s;
  }
  .fadeout {
    animation: animate_out 0.25s;
    opacity: 0;
  }
  @keyframes animate_in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes animate_out {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>
```
