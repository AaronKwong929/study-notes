# generator

## 迭代器

```js
function createIterator(items) {
  var i = 0;
  return {
    next: function () {
      var done = i >= items.length;
      var value = done ? undefined : item[i++];
      return {
        done,
        value,
      };
    },
  };
}
```

## 生成器

```js
function* createIterator() {
  yield 1;
  yield 2;
  yield 3;
}
```

通过对 Regenerator 转换后的生成器代码及工具源码分析，我们探究了生成器的运行原理。Regenerator 通过工具函数将生成器函数包装，为其添加如 next/return 等方法。同时也对返回的生成器对象进行包装，使得对 next 等方法的调用，最终进入由 switch case 组成的状态机模型中。除此之外，利用闭包技巧，保存生成器函数上下文信息。

上述过程与 C#中 yield 关键字的实现原理基本一致，都采用了编译转换思路，运用状态机模型，同时保存函数上下文信息，最终实现了新的 yield 关键字带来的新的语言特性。

⬆️ 抄来的
