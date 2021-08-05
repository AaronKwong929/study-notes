# 睡眠函数及其拓展

> https://github.com/shfshanyue/Daily-Question/issues/442

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210729094859.png)

```js
const sleep = seconds => new Promise(resolve => setTimeout(resolve, seconds));

sleep(3000).then(() => {
  console.log(111);
});

const delay = (func, seconds, ...args) =>
  new Promise(resolve =>
    setTimeout(() => Promise.resolve(func(...args)).then(resolve), seconds)
  );

delay(
  str => {
    console.log(str);
    return str;
  },
  3000,
  `hello world`
).then(res => console.log(res));
```
