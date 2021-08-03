# Vue DevTool open in editor 的一些想法

launch-editor-middleware 是基于 launch-editor 的一个封装：判断参数类型, 判断文件是否存在以及读出路径，再传入 launch-editor 完成打开工作

## 记一些东西

### launch-editor-middleware.js 的参数传递

```js
// 第六行
if (typeof specifiedEditor === 'function') {
  onErrorCallback = specifiedEditor;
  specifiedEditor = undefined;
}

if (typeof srcRoot === 'function') {
  onErrorCallback = srcRoot;
  srcRoot = undefined;
}
```

这里对参数传入进行了判断，对应

```js
// nod_modules/@vue/cli-service-lib-commands/serve.js:195
app.use(
  '/__open-in-editor',
  launchEditorMiddleware(() =>
    console.log(
      `To specify an editor, specify the EDITOR env variable or ` +
        `add "editor" field to your Vue project config.\n`
    )
  )
);
```

这里直接传入了 onErrorCallback，对比之前项目里的做法则是 `func(null, null, () => {})`，多了两个 null 会较为冗余，这种类似函数重载的方式可以增强代码可读性

### launch-editor 包

区分执行环境，然后使用 child_process.spawn 去产生一个子进程执行编辑器打开文件命令。其中 windows 系统下需要额外执行一个 cmd 去打开文件（spawn 只能启动.exe）

guessEditor 先判断系统环境，再根据外部传入的参数去判断在使用的编辑器

## 总结

看这篇源码，重点是学习到一些方法，不是完全去掌握整个执行流程。

launch-editor 判断系统环境，然后通过传入的 editor 以及获取进程比对确定出目标编辑器，然后通过 child_process 的 spawn 去执行命令打开文件；launch-editor-middleware 是基于此封装的中间件

尝试进行源码调试，打开到调试位置先去看整个函数体大概的样子，不用先去纠结函数细节，先明白函数做了什么

学习这个最直接的收获即是打开文件位置不用问同事，跑起项目 open-in-editor 即可

类似于函数重载的判断入参类型进行参数转换

包装回调函数
