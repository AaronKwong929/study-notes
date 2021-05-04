# 封装的一些通用组件

## 组件列表

- LightModal 轻弹框，针对文本图片，一个关闭按钮
- Loading 加载组件
- MessageBox 信息弹窗，含有确认取消功能
- MySwitch 开关
- Toast 轻提示
- Message 仿 Element-UI 的弹框提示组件
- AreaPicker 地址选择器
- Collapse ？

```javascript
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

```javascript
// main.js
import Message from "@components/Message";
Vue.prototype.$adminMessage = Message;
// use example
this.$adminMessage.success({ content: `` });
```
