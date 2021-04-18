# 移动端开发疑难杂症

1. iOS 的原生 input 不要使用 height 来撑高度，要使用 line-height 或者不设置

2. iOS absolute 和 fixed 布局 一定要写参照组件（position: relative;）以及一定要写 top/bottom与left/right，不然会导致错位

3. 