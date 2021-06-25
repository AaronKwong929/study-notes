# 封装 echarts 业务组件的一些思路

## 组件基本结构

![完成图.jpg](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures//20210618094629.png)

![草图.jpg](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures//20210618094132.png)

顶部展示该图表的名称，以及一个 slot 作为图表自定义操作

按钮区点击对应的按钮以切换数据展示，可以同时选中 2 个按钮的数据进行渲染，最少选中 1 个

图表区用于挂载 Echarts 实例

区分了两个组件分别用于渲染单指标数据和双指标数据（根据传入数据的长度判断，0->没数据；1->单指标；2->多指标）

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures//20210618120309)

#### 切换数据导致图线自定义颜色错误的问题

选中的数据前一个是蓝线，后一个是绿线，从 1，2 到 2，3：产品要求是 2 变成蓝色，3 变成绿色。直接切换数据会导致按钮 2 （蓝色）但实际上是绿线，3（绿色）但图线是蓝色

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures//20210618115247)

如图，如果是已选中两个选第三个进行切换的话，使用 nextTick 的方式延迟数据进入选中列表，导致渲染组件从双指标->单指标->双指标，相当于实现了一次重新挂载，确保渲染的自定义颜色是正确的

### Echarts - tooltip 渲染函数

需求有下面几种表现形式

#### 单指标

1. 单指标 - 单日 - 分时（0:00-24:00）

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210618111848.png)

2. 单指标 - 单日 - 今时(xx:00-xx:59)

3. ...

#### 双指标

1. 双指标 - 单日 - 分时(0:00-24:00)

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210618112057.png)

多种渲染要求不做赘述，想要实现效果要在 tooltip -> formatter 这个函数里做文章。

使用策略模式(map)，根据不同传入值选取不同的渲染函数

```js
return {
    tooltip: {
        ...tooltipNormalConfig,
        formatter: (params) =>
            chartType1TooltipFormatterFnMap[currentTrendlineDisplayMode](
                params,
                tooltipTitle,
                tooltipType
            ),
    },
};
```

### 标题渲染函数

在最外部传入一个 fn 以进行函数的区别渲染

```html
<content-card
    v-for="(item, index) in chartData"
    :key="`content-card-${index}`"
    :value="item"
    title-right
    :render-title-fn="renderTitleFn"
/>
```

```js
export default {
    props: {
        renderTitleFn: {
            type: Function,
            default: (el) => el.name,
        },
    },
};
```

```html
<div :class="bem(`title__left`)" @click="handleLabelClick">
    {{ renderTitleFn(value) }}
</div>
```

### Vue3 过度包装 Echarts 实例

因 vue3 中使用了 Proxy 对象代理，但 echarts 中使用了大量的===造成对比失败。

对 Proxy 对象进行拆箱。

```js
export const unwrap = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
```
