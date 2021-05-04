# 加载组件

```js
import PageLoading from "./Loading.vue";

export default function (vue) {
  const Constructor = vue.extend(PageLoading);
  const Instance = new Constructor();
  let timeout;
  Instance.$mount();

  // 简易模式 定义弹出组件的函数
  vue.prototype.$showLoading = ({
    id = "",
    text = "",
    txtColor = "#fff",
    color = "#fff",
    bgColor = "#ffffffAA",
    spinnerColor = "#00000099",
    type = "normal",
    mask = true,
    duration = 0,
  }) => {
    (Instance.text = text), //文字
      (Instance.txtColor = txtColor), //文字颜色
      (Instance.color = color), //loading颜色
      (Instance.bgColor = bgColor), //背景颜色
      (Instance.spinnerColor = spinnerColor), //加载颜色
      (Instance.size = type == "mini" ? 50 : 100), //loading大小
      (Instance.isShow = true), // 是否显示组件
      (Instance.type = type), //类型，mini为小框，normal为页面
      (Instance.mask = mask); //是否显示遮罩
    if (!id) {
      document.body.appendChild(Instance.$el);
    } else {
      document.getElementById(id).appendChild(Instance.$el);
    }
    if (duration != 0) {
      // 过了 duration 时间后隐藏整个组件
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        Instance.isShow = false;
      }, duration);
    }
    return Instance;
  };

  vue.prototype.$hiddenLoading = () => {
    Instance.isShow = false;
  };
}
```

```html
<template>
  <div
    class="loading-container"
    v-if="isShow"
    :style="
      mask ? 'background-color:' + bgColor + ';' : 'background-color:#00000000;'
    "
  >
    <div
      :class="'spinner-container ' + (type != 'normal' ? 'borrad-15' : '')"
      :style="
        'position:absolute; background-color:' +
        spinnerColor +
        ';' +
        (type == 'mini'
          ? 'width:100px;height:100px'
          : type == 'mid'
          ? 'width:200px;height:200px'
          : ' width:100%;height:100%')
      "
    >
      <div
        class="spinner"
        :style="'width:' + size + 'px;height:' + size + 'px;'"
      >
        <div class="loading-txt" :style="'color:' + txtColor + ';'" v-if="text">
          {{ text }}
        </div>
        <div class="spinner-container container1">
          <div class="circle1" :style="'background-color:' + color + ';'"></div>
          <div class="circle2" :style="'background-color:' + color + ';'"></div>
          <div class="circle3" :style="'background-color:' + color + ';'"></div>
          <div class="circle4" :style="'background-color:' + color + ';'"></div>
        </div>
        <div class="spinner-container container2">
          <div class="circle1" :style="'background-color:' + color + ';'"></div>
          <div class="circle2" :style="'background-color:' + color + ';'"></div>
          <div class="circle3" :style="'background-color:' + color + ';'"></div>
          <div class="circle4" :style="'background-color:' + color + ';'"></div>
        </div>
        <div class="spinner-container container3">
          <div class="circle1" :style="'background-color:' + color + ';'"></div>
          <div class="circle2" :style="'background-color:' + color + ';'"></div>
          <div class="circle3" :style="'background-color:' + color + ';'"></div>
          <div class="circle4" :style="'background-color:' + color + ';'"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => {
      return {
        text: "", //文字
        txtColor: "", //文字颜色
        color: "", //loading颜色
        bgColor: "", //背景颜色
        spinnerColor: "", //加载颜色
        size: 50, //loading大小
        isShow: false, // 是否显示组件
        type: "", //类型，mini为小框，normal为页面
        mask: false, //是否显示遮罩};
      };
    },
  };
</script>

<style lang="scss">
  .loading-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      .loading-txt {
        text-align: center;
        font-size: 12px;
      }
    }
  }
  .borrad-15 {
    border-radius: 15px;
  }
  .spinner {
    margin: 20px auto;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container1 > div,
  .container2 > div,
  .container3 > div {
    width: 6px;
    height: 6px;
    border-radius: 100%;
    position: absolute;
    -webkit-animation: bouncedelay 1.2s infinite ease-in-out;
    animation: bouncedelay 1.2s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  .spinner .spinner-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .container2 {
    -webkit-transform: rotateZ(45deg);
    transform: rotateZ(45deg);
  }

  .container3 {
    -webkit-transform: rotateZ(90deg);
    transform: rotateZ(90deg);
  }

  .circle1 {
    top: 0;
    left: 0;
  }
  .circle2 {
    top: 0;
    right: 0;
  }
  .circle3 {
    right: 0;
    bottom: 0;
  }
  .circle4 {
    left: 0;
    bottom: 0;
  }

  .container2 .circle1 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .container3 .circle1 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }

  .container1 .circle2 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .container2 .circle2 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  .container3 .circle2 {
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
  }

  .container1 .circle3 {
    -webkit-animation-delay: -0.6s;
    animation-delay: -0.6s;
  }

  .container2 .circle3 {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s;
  }

  .container3 .circle3 {
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s;
  }

  .container1 .circle4 {
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s;
  }

  .container2 .circle4 {
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s;
  }

  .container3 .circle4 {
    -webkit-animation-delay: -0.1s;
    animation-delay: -0.1s;
  }

  @-webkit-keyframes bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
    }
  }

  @keyframes bouncedelay {
    0%,
    80%,
    100% {
      transform: scale(0);
      -webkit-transform: scale(0);
    }
    40% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
</style>
```
