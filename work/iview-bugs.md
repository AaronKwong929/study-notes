# IView 的一些坑

## 表单校验

> 虽然都是 async-validator，iView 明显是没有 Element 做得舒服的

对输入框的 v-model 赋值，如果 Input `this.$set`进去的是个数字的话，表单校验就会直接报错警告（就算已经有值在里面）

解决方法：在`this.$set()`里面，将数字转成 String String(number) / number + ``/`${number}`
