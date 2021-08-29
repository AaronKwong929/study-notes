# ES6 的二进制操作类

> 面试问到这个答不出来，查漏补缺

首先是 MDN 的[ArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

开辟固定大小范围的一块内存，但是不能通过索引去操作

大小无法被修改，想要访问单块内容需要使用`视图 Typed Array`

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210827144536.png)

```js
// 分配一个长度为 8字节 的连续空间
const buffer = new ArrayBuffer(8);
console.log(buffer);
```

若想操作内存块里的数据，需要用到`Typed Array`

`Int8Array Int16Array Int32Array`

```js
const buff = new Int8Array(buffer);
buff[0] = 16;
console.log(buff);
```

传入同一块内存块的引用则是操作同一块内存块

```js
const buff2 = new Int16Array(buffer);
console.log(buff);
buff[1] = 8;
console.log(buff2);
```

## 注意

越界不会报错，但是多余的位会被切除
