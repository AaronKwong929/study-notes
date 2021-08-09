# 封装的一些通用组件

- 组件列表

  - Virtual Scroll 虚拟滚动

  - 组织架构树 多层级的组织架构树

  - JSON Viewer 可折叠的 JSON 文本查看组件

  - AreaPicker 地址选择器

  - Message 仿 Element-UI 的弹框提示组件

  - Loading 加载组件

  - MessageBox 信息弹窗，含有确认取消功能

  - Toast 轻提示

```js
import `componentName` from `${path}/${useComponent}/`;
Vue.use(componentName);

// use example:

this.$toast("message");

this.$MessageBox({
  title: "",
  content: ""
})
  .then(() => {})
  .catch(() => {});
```

### 全局注册

```js
// main.js
import Message from '@components/Message';
Vue.prototype.$adminMessage = Message;
// use example
this.$adminMessage.success({ content: `` });
```
