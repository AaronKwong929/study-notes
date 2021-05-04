# 消息弹窗，包含确认 / 取消

## 完整代码

```js
import component from "./MessageBox.vue";
export default function (Vue) {
  const Constructor = Vue.extend(component);
  const Instance = new Constructor();
  Instance.$mount();

  document.body.appendChild(Instance.$el);
  Vue.prototype.$MessageBox = ({
    title = "",
    content,
    confirmTxt = "确定",
    cancelTxt = "取消",
  }) => {
    Instance.visible = true;
    Instance.title = title;
    Instance.content = content;
    Instance.confirmTxt = confirmTxt;
    Instance.cancelTxt = cancelTxt;

    return Instance.showMsgBox()
      .then((val) => {
        return Promise.resolve(val);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };
}
```

```html
<template>
  <div v-show="visible" class="message-box">
    <div class="box">
      <h3 class="box-title">{{ title }}</h3>
      <div class="box-content">{{ content }}</div>
      <div class="box-btns">
        <button @click="clickCancel" class="btn-cancel">{{ cancelTxt }}</button>
        <button @click="clickConfirm" class="btn-confirm">
          {{ confirmTxt }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MessageBox",
    data() {
      return {
        visible: false,
        title: "",
        content: "内容",
        confirmTxt: "确定",
        cancelTxt: "取消",
        resolve: "",
        reject: "",
        promise: "",
      };
    },
    methods: {
      clickConfirm() {
        this.visible = false;
        this.resolve("confirm");
      },
      clickCancel() {
        this.visible = false;
        this.reject("cancel");
      },
      showMsgBox: function () {
        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
        });
      },
    },
  };
</script>

<style scoped>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .message-box {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .box {
    width: 360px;
    height: 225px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.3);
    padding: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .box-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .box-content {
    height: 90px;
    overflow-y: auto;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }

  .box-btns {
    width: 100%;
    padding: 0 10%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
  }

  .btn-confirm,
  .btn-cancel {
    width: 90px;
    height: 30px;
    font-size: 15px;
    border: none;
    outline: none;
    margin-left: 10px;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-confirm {
    background: #00d090;
    color: white;
  }

  .btn-cancel {
    color: #00d090;
    background-color: #fff;
  }
</style>
```
