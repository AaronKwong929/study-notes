# echarts 的暗坑

## Y 轴传入的数值是百分比会显示不出来

这是 echarts 的暗坑，需要对传入的值进行判断，动态改变 yAxis 的 label

### 单列数据的情况

```js
// map，判断 yAxis 的 label 应该如何渲染
const yAxisLabelFormatter = Object.freeze({
  value: `{value}`,
  precent: `{value}%`,
});
// map，是否需要对数据进行格式化
const yDataFormatMap = Object.freeze({
  value: (val) => val,
  precent: (val) => parseFloat(val),
});
```

```js
// 这是用来判断传入值类型是否是字符串，是则再判断这个字符串是否包含百分号，如果有可以判断传入的数据是百分比数据
if (
  col.data.some((item) => {
    if (getType(item.value) === `string`) {
      return item.value.includes(`%`);
    }
  })
) {
  yAxisType = `precent`;
}
```

```js
// yAxis的配置，主要是label这里，用series闭包取到的yAxisType来决定渲染方式
yAxis: {
          // // type: 'value',
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: yAxisLabelFormatter[yAxisType], // ← 这里
          },
          // // axisLine: {
          // //   show: false,
          // // },
          // // axisTick: {
          // //   show: false,
          // // },
          // // splitLine: {
          // //   // 网格线
          // //   lineStyle: {
          // //     type: 'dashed', // dotted-虚线 solid-实线
          // //   },
          // //   show: true, // 是否显示
          // // },
        },
```

### 多列数据的情况

也不难，将闭包放到外面即可

```js
const yAxisTypes = [`value`, `value`];

// yAxis变成了数组，操作类似
yAxis: [
          {
            // // position: `left`,
            // // type: 'value',
            // // axisLine: {
            // //   show: false,
            // // },
            // // axisTick: {
            // //   show: false,
            // // },
            // // splitLine: {
            // //   // 网格线
            // //   lineStyle: {
            // //     type: 'dashed', // dotted-虚线 solid-实线
            // //   },
            // //   show: true, // 是否显示
            // // },
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: yAxisLabelFormatter[yAxisTypes[0]],
            },
          },
          {
            // // position: `right`,
            // // type: 'value',
            // // axisLine: {
            // //   show: false,
            // // },
            // // axisTick: {
            // //   show: false,
            // // },
            // // splitLine: {
            // //   // 网格线
            // //   lineStyle: {
            // //     type: 'dashed', // dotted-虚线 solid-实线
            // //   },
            // //   show: true, // 是否显示
            // // },
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: yAxisLabelFormatter[yAxisTypes[1]],
            },
          },
        ],
```

## 移动端下，数据表失焦后浮窗不会自动关闭的解决办法

目前的解决方案比较粗略，在点击部分表单的情况下会出现这个情况，如图所示

![pic](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210605113101.png)

通过 event-bus 在需要隐藏 tooltip 时触发一个事件，在 echarts 组件里监听事件，使用 echarts 提供的 dispatchAction 进行隐藏

```js
const clearTooltip = () => {
  chartInstance.dispatchAction({ type: `hideTip` });
};

$bus.on(`handle-hide-tooltip`, clearTooltip);
```

dispatchAction 内容可以参考[官网](https://echarts.apache.org/zh/api.html#echartsInstance.dispatchAction)，自动轮播 tooltip 也是以 dispatchAction 为核心进行完成的
