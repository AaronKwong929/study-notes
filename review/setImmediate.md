# 关于 setImmediate

> 本代码将在当前事件轮询中的任何 I/O 操作 后，在任何下一轮定时器`前`执行。代码执行可以被认为是“在此之后立即执行”，这意味着任何紧跟着 setImmediate() 函数调用将在 setImmediate() 函数参数前执行。

setImmediate 在 node 下支持

```js
let id = setImmediate(() => {});
clearImmediate(id);
```

`process.nextTick()`微任务，始终会比 `setImmediate` 和 `setTimeout` 先执行，并且 `nextTick` 不可以被中断

`setImmediate(fn)`和`setTimeout(fn, 0)`都是在下一轮事件循环中执行，具体顺序不定

哪个回调先执行，需要看他们本身在哪个阶段注册的，如果在定时器回调或者 I/O 回调里面，setImmediate 肯定先执行。

如果在最外层或者 setImmediate 回调里面，哪个先执行取决于当时机器状况。

## 其他

其他详细内容需要参考[Node 事件循环](/review/node-event-loop.md)
