# 关于 BFC

> Block Formatting Contexts 格式化上下文

页面中的一块渲染区域，决定了它的子元素如何定位，以及和周边其他元素的关系和相互作用

> 可以理解为 BFC 内的元素无论怎么折腾都不会影响外部的元素

## 触发 BFC

1. body 根元素

2. 浮动元素：`float` 不为 `none` 即可

3. 绝对定位元素(absolute, fixed）

4. display 为 flex, table-cells, inline-block

5. overflow 除 visible 以外的值(hidden, auto, scroll)

## 有什么用

1. 同一个 BFC 下外边距会发生折叠

```html
<head>
  <style>
    div {
      width: 100px;
      height: 100px;
      background: lightblue;
      margin: 100px;
    }
  </style>
</head>
<body>
  <div></div>
  <div></div>
</body>
```

两个元素之间相距 `100px`

2. 可以阻止元素被浮动元素覆盖

3. 可以包含浮动的元素（清除浮动）
