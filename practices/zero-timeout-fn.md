# 如何写一个尽量准确的 setTimeout

setTimeout / setInterval 有最小延迟时间 4ms，嵌套层数多了打印就会不准确

## requestAnimationFrame

## window.postMessage

```js
(function () {
    const timeouts = [],
        messageName = `zero-timeout-message`;

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

    window.addEventListener(`message`, setZeroTimeout, true); // 添加事件

    window.setZeroTimeout = setZeroTimeout; // 挂载到 window 上
})();
```
