# 轻弹窗组件

```html
<template>
  <div class="light-modal-container" v-if="visible">
    <div class="light-modal-body">
      <slot name="content"></slot>
    </div>
    <div class="light-modal-close" @click="onHidden">
      <img src="@/assets/images/close.png" alt />
    </div>
  </div>
</template>

<script>
  export default {
    name: "LightModal",
    props: {
      visible: { type: Boolean, default: false },
    },
    methods: {
      onHidden: function () {
        this.$emit("update:visible", false);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .light-modal-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 998;
    background-color: #0000008c;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .light-modal-body {
      width: 90%;
      margin: 27px auto;
      min-height: 200px;
      background-color: #fff;
      border-radius: 11px;
      padding: 0 20px 20px 20px;
    }
    .light-modal-close {
      height: 40px;
      width: 40px;
      border: 2px solid white;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        margin: 10px;
        height: 16px;
        width: 16px;
      }
    }
  }
</style>
```
