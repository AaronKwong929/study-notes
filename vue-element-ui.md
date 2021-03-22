# 关于 Element-UI 遇到的问题记录

## 关于按需引入 MessageBox 等

注意 Message.confirm，不然实际使用时，this.$confirm(content,title,option)里的 option 会无效

```js
import { MessageBox, Message } from "element-ui";
Message.install = function (Vue, options) {
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$message = Message;
};
```

