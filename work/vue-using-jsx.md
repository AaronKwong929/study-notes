# 在 Vue 里使用 JSX 要注意的东西

> 前段时间套用了大佬的 vue-okr-tree 组件，渲染节点组件需要使用 jsx 写 render 函数，在这里记录一下在 vue 里写 jsx 需要注意什么

1. 变量

变量的写法都用 {} 包起

1. 事件

不能使用 @click 等，需要写 onClick={}，并且执行 methods 里的其他方法的时候需要这样写：

```js
render(h) {
    return (<button onClick={() => this.doSth()}>click</button>)
}
```

2. 传参

3. 组件引入

平时写 vue 组件引入的时候会比较习惯以下写法，即使用 kabeb case 写标签

```html
<html>
  <form-dialog />
</html>
<script>
  import FormDialog from "...";
  export default {
    components: {
      FormDialog,
    },
  };
</script>
```

但在 JSX 片段里不可以这么做，怎么引入的就要怎么写，而且不需要在 coponents 处导入（导入了会报引入未使用的错

```jsx
renderFunction(h) {
    return (<FormDialog />);
}
```
