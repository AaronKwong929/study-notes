# 2021 年菜鸡面试全记录

笔者 2020.6 毕业于广州某高水平大学，计算机学院，软件工程专业。大四上学期开始实习并一直工作到时下。

2021.3 老东家在线教育项目解散，转岗并开始复习。

8 月下旬开始投简历，boss 投递 + 朋友内推，先后投递了拼多多，yy 直播，欢聚，字节跳动，虎牙，基本上每天都在面，白天上班晚上面试，大概持续了两周左右

## 面经

### 拼多多商家端一面（40 分钟）

1. 简历项目问询 - 细节

2. 垂直水平居中

3. 一个简单请求的 header 会有什么字段

4. map, filter, reduce 都怎么用

5. symbol 有了解吗

6. ES5 继承，ES6 类继承，静态方法

7. Promise 超时控制

8. DFS 找节点

9. node 有什么特性，适合用来做什么

10. midway 对比 egg 有什么优势

11. typescript 有没有实践过

12. 平时有用什么设计模式吗

13. 平时打包工具 - Webpack 相关

14. 你有没有哪些我没问到你想说的

15. 缓存相关，cdn 缓存处理

16. 你有什么想问的

### 拼多多商家端二面（65 分钟）

1. 压力面，质疑观点

2. 拍平数组

```js
const flatten = (list, level = +Infinity) => {
  // ...
};
const array = [1, [2, [3, 4, [5]], 3], -4];
const list1 = flatten(array);
const list2 = flatten(array, 2);
console.log(list1); // [1, 2, 3, 4, 5, 3, -4]
console.log(list2); // [1, 2, 3, -4]
```

3. promise

```js
const myPromise = val => Promise.resolve(val);
const delay = duration => {
  // ...
};
myPromise(`hello`)
  .then(delay(1000))
  .then(val => console.log(val)); // 一秒之后输出 hello
```

### 拼多多商家端三面（30 分钟）

1. 项目细节问询

2. Vue 源码有读吗 - 响应式原理，nextTick

3. 最近有没有研究什么新技术

4. 项目优化有哪些实践

5. V8 如何执行一段代码

6. 72-编辑距离

7. 226-翻转二叉树

8. 性能优化的实践

9. 有其他想问的吗

---

### 欢聚一面（90 分钟）

1. 项目细节，ci/cd 详细问，重构详细问，详细介绍题目录入

2. vue 的 history 和 hash 模式区别，hash 与 ssr

3. https 基本原理

4. ca 证书怎么确保真实性

5. cors 是什么，同域又是什么

6. 怎么解决前后端通信跨域

7. 可以 node 转发绕过跨域，为什么浏览器还是要做 cors

8. 除了 webpack proxy ，nginx，后端配 cors 头，还有什么跨域方案

9. xss 攻击怎么防范，除了转译呢，转译出来的那个叫什么

10. es6 的二进制操作？

11. 说一下思路怎么去实现一个 promise

12. promise 怎么能够保证 then 的顺序执行

13. worker 有了解过吗

14. ssr 的原理？

15. 性能优化有哪些实践

16. 有没有在研究什么

17. 手写：min 到 max 的随机数，整数和小数的方案

18. 场景：多个属性，每个属性都是数组，求属性聚合结果

19. 场景：用户点击按钮没反应，怎么去定位错误（除开 QA 环节能检查到的错误）

20. 有什么想问的

### 欢聚二三面

二面部门终面，三面 hr 面，现场一天面完，主要是和部门领导交流，关于项目组以及负责的模块；了解薪酬福利相关

---

### yy 直播一面（30 分钟）

1. 项目的 CI/CD 怎么配置的，jenkins 怎么部署，为何没有直接部署单独机器，内网互通去传送文件发布，git 权限怎么配的

2. vue-router hash/history 区别

3. vuex 里面有哪些东西，分别用来干嘛的

4. vuex 分了模块，有全局通用的内容是怎么配置的

5. 除了直接调用命名空间模块还有办法直接访问需要放在全局模块下的东西吗

6. Vue 的响应式原理

7. 子组件的 data 变化，那么父子组件的更新是怎么样进行的

8. 双向绑定，那么视图数据更新怎么影响到 data 里的数据

9. Vue 的生命周期有哪些

10. 项目内怎么通信 - (EventBus/emit-on/vuex)

11. EventBus 实现原理，有没有多条事件总线的情况，怎么解决可能重名的问题

12. 移动端里的单位 - rem/vh/vw

13. postCss rem=>px，设计稿上 750 宽度是怎么去算的

14. 移动端有什么性能优化的点 - 虚拟滚动

15. typescript 有写过吗有了解吗

16. 说一下你理解的泛型

17. webpack loader 项目里有用哪些？

18. 一个.mp4 文件加载的话需要用哪些 loader

19. 有开发 webpack 插件吗？是要怎么开发

20. http 有多少版本

21. http 1 2 3 的版本区别

22. http2 和 1 的区别，解决了什么东西

23. http3 解决了 http1 和 2 什么问题

24. http3 什么问题没想起来

25. http 缓存

26. cdn 缓存是强缓存还是协商缓存

---

### 字节跳动 一面

1. 输出结果

```js
var a = 3;
var total = 0;
var result = [];
function foo(a) {
  var i = 0;
  for (; i < 3; i++) {
    result[i] = function () {
      console.log(i, a);
      total += i * a;
      console.log(total);
    };
  }
}
foo(1);
result[0]();
result[1]();
result[2]();
```

2. Promise 输出顺序

3. 给一个 n，生成一个`[0, n-1)`乱序数组

4. 这个时间复杂度是多少，能进行优化吗

5. 看你写的这个有用 sort，为什么是 O(nlogn)呢

6. 还能再优化下吗

7. 说一下快排原理？

8. 三路快排是怎么个三路法

9. 还了解其他一些排序吗

10. 详细说下归并排序

11. 稳定和不稳定排序怎么界定？

12. 了解一些时间顺序相关的 api 吗

13. requestAnimationFrame 有了解过吗

14. setImmediate 和 setTimeout 和 setInterval？

15. 项目细节，最有成就感的需求是哪个？

16. base64 是怎么样转码的

17. 为何转了 json 协议之后可以优化图片上传

18. 如果公网上传的话，怎么防止不被人拿来做图床

19. xss 的话怎么防止

20. Vue 的生命周期有哪些

21. created 和 beforeMount 有何区别

22. render 函数和 jsx

23. Vue 怎么转 js 代码的？

24. computed 里面的懒更新是怎么实现的

### 字节跳动 二面（47 分钟）

1. 自我介绍

2. 最有成就感的项目细问

3. react fiber 原理

4. 求蓝色区域的宽 高

```html
<html>
  <style>
    .box {
      padding: 2px;
      margin: 2px;
      width: 10px;
      height: 10px;
      background: blue;
      border: 1px solid black;
    }
    #content-box {
      box-sizing: content-box;
    }
    #border-box {
      box-sizing: border-box;
    }
  </style>
  <body>
    <div class="box" id="content-box"></div>
    <div class="box" id="border-box"></div>
  </body>
</html>
```

5. 输出结果

```js
var length = 10;
function fn() {
  return this.length + 1;
}
var obj1 = {
  length: 5,
  test1: function () {
    return fn();
  },
};

obj1.test2 = fn;

console.log(obj1.test1());
console.log(fn() === obj1.test2());
```

6. 拍平数组，去重，排序

7. leetCode 103 + 拍平结果

### 字节跳动三面（65 分钟）

（看到前面两面的内容/评价）问：是不是有专门准备过？

项目细节，实现原理，痛点解决方案，可以优化的方案，怎么实现这个优化的方案

题库整个的实现原理，移动端 table 虚拟滚动不定高的实现原理

平时和产品怎么交流；不相同意见的时候怎么处理

前面几面面试体验怎么样；有哪些问的东西难倒你了

一个二维数组对应骰子的上下两面，其他四面已被磨平，两面的数字都是 1-6 随机一个数，但不会重复，想要所有的上面或者下面都是同一个数字，最少需要翻几次

### 字节跳动 换部门 加面（60 分钟）

1. 题库和重构细节

2. 题库的优化迭代有没有具体的数据可以支撑？

3. 前面几轮有没有碰到特别难的不会的点？

4. https tls 连接详情，几个 rtt

5. promise 优缺点

6. promise 怎么控制异步

7. 闭包

8. 继承

9. promise 输出顺序

10. typescript 泛型

11. 首页白屏优化

12. 算法

### 字节换部门 hr 面（50 分钟）

1. 自我介绍

2. 最有成就感的需求

3. 这个需求有没有可以优化的点

4. 希望是一个怎么样的工作环境

5. 觉得自己的优点是什么

6. 放到市场上自己的优势在哪里

7. 平时学习的途径

8. 可以说下你关注了哪些技术公众号吗

9. 家常

10. 期望薪资

11. 工作地区相关

12. 部门相关

## 总结

代码相关：JavaScript 基础重中之重，工程化方向的了解和实践也必不可少，这次面试下来还是发现到自己对于 Node，TypeScript，Webpack 等会有短板存在。

业务相关：对自己负责的业务模块一定要做好总结和复盘，寻找优、缺点，漏洞，思考优化/解决方案。

给自己一个时间点，到了这个点就开始投，不然没有时间限制，这里复习一下，那里学一下，复习进度就会拖慢。

面试官们也都很友好，遇到卡住的情况会尝试引导你去做，实在想不出来也可以说说自己大概的思路。

## 要感谢的人

同学和同事们都给了我很大的帮助，有给我复习方向，以及各种内推机会。包括之前提桶焦虑，左怕右怕，担心自己复习得不到位，可能面什么都凉。尤其是[李总](https://github.com/logcas)最初带我学前端的大佬，给了我很大的鼓励，面试之后复盘的复习点总结也帮助了我许多。

[若川视野](https://lxchuan12.gitee.io/)川哥，源码共读活动带着我从简单的源码开始读起，慢慢去拓展到大型源码库；在川哥源码共读群认识了[年哥](blog.ori8.cn)，给我复习的方向和节奏都给了很大的指引。

## 复习中有参考的内容

霖呆呆大佬的掘金文章，promise，this 相关

川哥的源码共读系列
