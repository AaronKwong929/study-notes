# V8 怎么去执行一段 JS 代码

## 编译器/解释器

- 编译型语言

  - 执行前需要编译

  - 编译后保留二进制文件，再次运行不需重新编译

  - C/C++, GO 等

- 解释型语言

  - 每次运行时需要解释器进行动态解析和执行

  - python, javascript

具体执行流程

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210826165257.png)

编译型语言：编译器对源代码进行`词法分析`，`语法分析`，生成 AST，优化代码，生成机器码

解释型语言：词法分析，语法分析，生成 AST，再基于 AST 生成字节码，根据字节码执行程序

## V8 如何执行一段 js 代码

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210826165536.png)

- 1 - 生成 AST 和执行上下文

  - 词法分析（分词）

  - 语法分析（解析）

  - 生成执行上下文

- 2 - 生成字节码

  - 解释器 Ignition - 根据 AST 生成字节码

    - 字节码介于 AST 和机器码，优化内存占用

- 3 - 执行代码

  - 第一次执行的代码，解释器 Ignition 逐条解释执行

  - 如果发现热区代码 编译器 TurboFan 讲其编译为机器码，再次使用直接运行

![](https://cdn.jsdelivr.net/gh/aaronkwong929/pictures/20210826165958.png)

## 一句话

V8 依据 JavaScript 代码生成 AST 和执行上下文，再基于 AST 生成字节码，然后通过解释器执行字节码，通过编译器来优化编译字节码。
