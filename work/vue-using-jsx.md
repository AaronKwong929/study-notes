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

```js
// 节点树渲染 - jsx
    renderContent(h, node) {
      const cls = ['tree_node'],
        orderMap = Object.freeze({
          1: `第一`,
          2: `第二`,
        });

      return (
        <div class={cls} onClick={() => this.handleClickNode(node.data)}>
          <div class="tree_node__name">{node.data.label}</div>
          <div class="tree_node__principle_list">
            {node.data.principleList &&
              node.data.principleList.map(principle => (
                <div class="tree_node__principle_list__item">
                  <div class="tree_node__principle_list__item__order">
                    {orderMap[principle.order]}负责人：
                  </div>
                  <div class="tree_node__principle_list__item__name">
                    {principle.name}
                  </div>
                </div>
              ))}
          </div>

          <div class="tree_node__alert_list">
            {node.data.businessAlertList &&
            node.data.businessAlertList.length > 0 ? (
              <span class="tree_node__alert_list__label">业务告警：</span>
            ) : (
              ``
            )}
            {node.data.businessAlertList &&
              node.data.businessAlertList.map(alert => (
                <div class="tree_node__alert_list__content">
                  <ContentAlertColorBlock
                    type="circle"
                    size="large"
                    simple={false}
                    data={alert}
                  />
                </div>
              ))}
          </div>

          <div class="tree_node__alert_list">
            {node.data.heartbeatAlertList &&
            node.data.heartbeatAlertList.length > 0 ? (
              <span class="tree_node__alert_list__label">心跳告警：</span>
            ) : (
              ``
            )}
            {node.data.heartbeatAlertList &&
              node.data.heartbeatAlertList.map(alert => (
                <div class="tree_node__alert_list__content">
                  <ContentAlertColorBlock
                    type="circle"
                    size="large"
                    simple={false}
                    data={alert}
                  />
                </div>
              ))}
          </div>
        </div>
      );
    },
```

```js
// 节点树渲染 - jsx
    renderContent(h, node) {
      const cls = ['tree_node'];
      return (
        <div class={cls} onClick={() => this.handleClickNode(node.data)}>
          <div class="tree_node__name">{node.data.label}</div>
          <div class="tree_node__id">节点ID：{node.data.id}</div>
          <div class="tree_node__first_principle">
            第一负责人：
            {node.data.principleList && node.data.principleList[0].name}
          </div>
        </div>
      );
    },
```
