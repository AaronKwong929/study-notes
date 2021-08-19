# 防抖和节流

## 防抖

随便触发事件，但是一定在事件触发 n 秒之后才执行，如果在这 n 秒内又触发了一次，以新的时间为准

开发中遇到频繁的事件触发如`表单提交`等

### 实现

```js
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, wait);
  };
}
```

不需要`if (timer)` ===> `clearTimeout(undefined)` 是可以的

## 节流

持续触发事件，每隔一段时间只执行一次 `scroll` 事件

计时器

```js
function throttle(fn, wait) {
  let timer;
  return (...args) => {
    if (timer) return;
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, wait);
  };
}
```

时间戳

```js
function throttle(fn, wait) {
  let previous = 0;
  return (...args) => {
    let now = Date.now;
    if (now - previous > wait) {
      fn(...args);
      previous = now;
    }
  };
}
```

## 总结

防抖 - 防止多次提交 -> 要 clearTimeout

节流 - scroll 事件 - 不要 clearTimeout，有 timeout 要 return
