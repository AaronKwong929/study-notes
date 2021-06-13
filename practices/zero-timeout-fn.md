# 如何写一个尽量准确的 setTimeout

setTimeout / setInterval 有最小延迟时间 4ms，嵌套层数多了打印就会不准确

## window.postMessage

由于 postMessage 的回调函数的执行时机和 setTimeout 类似，都属于宏任务，所以可以简单利用 postMessage 和 addEventListener('message') 的消息通知组合，来实现模拟定时器的功能。

> postMessage 的实现没有被浏览器引擎限制速度

```js
(function () {
  const timeouts = [];
  const messageName = `zero-timeout-message`;

  // 每一次加入一个方法就触发一次 postMessage
  function setZeroTimeout(fn) {
    timeouts.push(fn);
    window.postMessage(messageName, `*`);
  }

  // 处理函数，检测事件是否来自 window 以及是否是执行事件
  function handleFn(event) {
    if (event.source === window && event.data === messageName) {
      event.stopPropagation();
      const fn = timeouts.shift(); // 取队头并执行
      fn();
    }
  }

  window.addEventListener(`message`, handleFn, true); // 添加事件

  window.setZeroTimeout = setZeroTimeout; // 挂载到 window 上
})();
```
