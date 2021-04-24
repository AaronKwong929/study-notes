# Vant Dropdown Item 的暗坑

## 关于默认打开 VanDropdownItem 位置错乱 (vue3)

在进入路由 / 页面刷新时，需要默认打开 dropdownItem，通过 onMounted，nextTick 获取 dropdownItem 的 ref

进行 dropDownItemRef.value.toggle(true)，会发现 dropdownItem 的**绝对定位错误**了

不在对应的 dom 区域出现，直接在页面顶部出现

不知道是不是只是 vue3 版本的问题？为了验证我分别起 Vue2 和 Vue3 的项目

这是 Vue3 版本的，默认关闭状态，进入页面后我手动点击 dropdownItem 打开，在默认收起的情况下表现正常。

![vue3-dropdown-item default closed .png](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210423223818.png)

然后使用 onMounted 和 nextTick，以及 dom 实例来默认 toggle true，会出现定位错误的问题，如图所示，代码如下图所示

![vue3-dropdown-item default opened .png](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210423232250.png)

```html
<template>
  <div class="home">
    <div class="placeholder">这里是30vh占位</div>
    <van-dropdown-menu>
      <van-dropdown-item title="筛选" ref="item">
        <van-cell center title="包邮">
          <template #right-icon>
            <van-switch size="24" active-color="#ee0a24" />
          </template>
        </van-cell>
        <van-cell center title="团购">
          <template #right-icon>
            <van-switch size="24" active-color="#ee0a24" />
          </template>
        </van-cell>
        <div style="padding: 5px 16px;">
          <van-button type="danger" block round> 确认 </van-button>
        </div>
      </van-dropdown-item>
    </van-dropdown-menu>
  </div>
</template>
<script>
  import { onMounted, nextTick, ref } from "vue";
  export default {
    setup() {
      const item = ref(null);
      onMounted(() => {
        nextTick(() => {
          item.value.toggle(true);
        });
      });
      return {
        item,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .home {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .placeholder {
    height: 30vh;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
```

然而使用 vue2 版本的 vant 很正常！屁事没有

![vue2-dropdown-item-deafult-open .png](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210423231904.png)

代码如下所示

```html
<template>
  <div class="home">
    <div class="placeholder">这里是30vh占位</div>

    <van-dropdown-menu>
      <van-dropdown-item v-model="value" :options="option" />
      <van-dropdown-item title="筛选" ref="item">
        <van-cell center title="包邮">
          <template #right-icon>
            <van-switch v-model="switch1" size="24" active-color="#ee0a24" />
          </template>
        </van-cell>
        <van-cell center title="团购">
          <template #right-icon>
            <van-switch v-model="switch2" size="24" active-color="#ee0a24" />
          </template>
        </van-cell>
        <div style="padding: 5px 16px;">
          <van-button type="danger" block round @click="onConfirm">
            确认
          </van-button>
        </div>
      </van-dropdown-item>
    </van-dropdown-menu>
  </div>
</template>

<script>
  export default {
    name: "Home",

    data() {
      return {
        value: 0,
        switch1: false,
        switch2: false,
        option: [
          { text: "全部商品", value: 0 },
          { text: "新款商品", value: 1 },
          { text: "活动商品", value: 2 },
        ],
      };
    },

    methods: {
      onConfirm() {
        this.$refs.item.toggle();
      },
    },

    mounted() {
      this.$refs[`item`].toggle(true);
    },
  };
</script>
```

## 大概的原因？

从 F12 查阅区别，会发现异常状态下

.van-dropdown-item.van-dropdown-item--down

这个类的 top 属性是 0

而正常状态下这个值是在 .van-dropdown-menu\_\_item 以这个类为参照进行定位的

在再次点击筛选进行 dropdown 关闭时，这个 dropdownItem 诡异地刷到 menu_item 下再进行隐藏

无论是 Vue2 还是 Vue3 版本的 Vant 都是通过 parent 的 offset 来进行绝对定位的高度计算的

```js
// Vue3 - Vant - dropdown
// node_modules/vant/ib/dropdown-item/DropdownItem.js:144
var { offset } = parent;
// ...
var style = (0, _utils.getZIndexStyle)(zIndex);

if (direction === "down") {
  style.top = offset.value + "px";
} else {
  style.bottom = offset.value + "px";
}
```

```js
// Vue2 - Vant - dropdown
// node_modules/vant/ib/dropdown-item/DropdownItem.js:68
updateOffset: function updateOffset() {
      if (!this.$refs.bar) {
        return;
      }

      var rect = this.$refs.bar.getBoundingClientRect();

      if (this.direction === 'down') {
        this.offset = rect.bottom;
      } else {
        this.offset = window.innerHeight - rect.top;
      }
    },
```

很明显问题在于这个 parent，vue3 下引入 parent 的方式为

```js
var { parent } = (0, _use.useParent)(_DropdownMenu.DROPDOWN_KEY);
```

找到这个 useParent

```js
export function useParent(key) {
  var parent = inject(key, null);

  if (parent) {
    var instance = getCurrentInstance();
    var { link: _link, unlink: _unlink, internalChildren } = parent;
    _link(instance);
    onUnmounted(() => _unlink(instance));
    var index = computed(() => internalChildren.indexOf(instance));
    return {
      parent,
      index,
    };
  }

  return {
    parent: null,
    index: ref(-1),
  };
}
```

```js
// /node_modules/vant/lib/dropdown-menu/DropdownMenu.js:69
if (props.direction === "down") {
  offset.value = rect.bottom;
} else {
  offset.value = window.innerHeight - rect.top;
}
```

找到这个 rect 是一个 useRect 方法

```js
import { unref } from "vue";

function isWindow(val) {
  return val === window;
}

function makeDOMRect(width, height) {
  return {
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height,
  };
}

export var useRect = (elementOrRef) => {
  var element = unref(elementOrRef);

  if (isWindow(element)) {
    var width = element.innerWidth;
    var height = element.innerHeight;
    return makeDOMRect(width, height);
  }

  if (element && element.getBoundingClientRect) {
    return element.getBoundingClientRect();
  }

  return makeDOMRect(0, 0);
};
```

返回的 top 是 0，那么只能是上边的 useRect 给出了 0，给出 0 的情况：

1. useRect 参数指向 window

2. 不存在该 element

只能是不存在该 element 了

## 问题结论

dropdownMenu 找不到对应的 barRef 的实例，导致计算 rect 失败返回了 0

触发原因不知道（

## 不完美解决方案

Vue3 下通过获取 dom 实例进行一个点击事件，模拟用户点击来进行 dropdown 触发，vue2 没有这个问题

```js
onMounted(() => {
  const dom = document.querySelector(`.filter-details-ref`);
  dom &&
    dom.dispatchEvent(
      new Event(`click`, {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    );
});
```
