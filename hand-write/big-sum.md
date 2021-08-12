# 大数相加

用`Number.MAX_SAFE_INTEGER`得到 js 最大安全整型 `9007199254740991`

准备两个字符串变量

```js
const a = `9007199254740991`,
    b = `1234567899999999999`;

const add = (a, b) => {};
```

将字符串补齐长度 `String.prototype.padStart`

```js
const add = (a, b) => {
    const maxLength = Math.max(a.length, b.length);
    a = a.padStart(maxLength, 0);
    b = b.padStart(maxLength, 0);
};
```

然后从个位开始相加

```js
const add = (a, b) => {
    // 取两个数字的最大长度
    let maxLength = Math.max(a.length, b.length);
    //用0去补齐长度
    a = a.padStart(maxLength, 0); //"0009007199254740991"
    b = b.padStart(maxLength, 0); //"1234567899999999999"
    let t = 0;
    let f = 0; // 进位
    let sum = "";
    for (let i = maxLength - 1; i >= 0; i--) {
        t = parseInt(a[i]) + parseInt(b[i]) + f;
        f = Math.floor(t / 10);
        sum = (t % 10) + sum;
    }
    if (f == 1) {
        sum = "1" + sum;
    }
    return sum;
};
```
