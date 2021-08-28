# 高性能渲染大量 dom 数据

> 除开虚拟滚动，还可以用`时间切片`的方式来实现高性能挂载

直接一次性暴力挂载会卡

```html
<ul id="container"></ul>
```

```js
// 记录任务开始时间
let now = Date.now();
// 插入十万条数据
const total = 100000;
// 获取容器
let ul = document.getElementById('container');
// 将数据插入容器中
for (let i = 0; i < total; i++) {
  let li = document.createElement('li');
  li.innerText = ~~(Math.random() * total);
  ul.appendChild(li);
}

console.log('JS运行时间：', Date.now() - now);
setTimeout(() => {
  console.log('总运行时间：', Date.now() - now);
}, 0);
```

![](https://raw.githubusercontent.com/AaronKwong929/pictures/master/20210828174256.png)

当前宏任务和微任务执行完成之后才会触发页面渲染

对于大量数据渲染的时候，JS 运算并不是性能的瓶颈，性能的瓶颈主要在于渲染阶段

## 优化 1

页面卡顿是因为渲染阶段，那么优化点可以考虑分批渲染

```js
const ul = document.getElementById('container');
const total = 100000; // 插入十万条数据
const once = 20; // 一次插入 20 条
const page = total / once; // 总页数
let index = 0; // 每条记录的索引
// 循环加载数据
function mount(curTotal, curIndex) {
  if (curTotal <= 0) return;
  const pageCount = Math.min(curTotal, once); // 每页条数
  setTimeout(() => {
    for (let i = 0; i < pageCount; i++) {
      let li = document.createElement('li');
      li.innerText = curIndex + i + ' : ' + ~~(Math.random() * total);
      ul.appendChild(li);
    }
    mount(curTotal - pageCount, curIndex + pageCount);
  }, 0);
}
mount(total, index);
```

这样子可以优化一下，但是快速滚动的时候还是会白屏

## 优化 2

闪白屏是因为帧数不够 1000ms/60 = 16.67，超过 16.67ms 的话（60 帧）人类就会觉得流畅

setTimeout 固定时间间隔刷新，不和浏览器刷新率同步

`requestAnimationFrame`由系统来决定回调函数的执行时机，保证回调函数在屏幕每一次的刷新间隔中只被执行一次，不会引起丢帧

改造代码

```js
const ul = document.getElementById('container');
const total = 100000; // 插入十万条数据
const once = 20; // 一次插入 20 条
const page = total / once; // 总页数
let index = 0; // 每条记录的索引
// 循环加载数据
function mount(curTotal, curIndex) {
  if (curTotal <= 0) return;
  const pageCount = Math.min(curTotal, once); // 每页条数
  window.requestAnimationFrame(() => {
    for (let i = 0; i < pageCount; i++) {
      let li = document.createElement('li');
      li.innerText = curIndex + i + ' : ' + ~~(Math.random() * total);
      ul.appendChild(li);
    }
    mount(curTotal - pageCount, curIndex + pageCount);
  }, 0);
}
mount(total, index);
```

## requestAnimationFrame

```js
window.requestAnimationFrame(callback);
```

返回一个 long 型整数可以用于`window.cancelAnimationFrame`

之前用于锚点滚动动画

## 思考

这个可以作为[虚拟滚动](/components/VirtualScroll.md)的下位应对方案

## 参考

[「前端进阶」高性能渲染十万条数据(时间分片)](https://juejin.cn/post/6844903938894872589)
