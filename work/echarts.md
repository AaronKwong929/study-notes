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