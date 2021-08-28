# 自动注册 plugins/vuex 组件等

## require.context

webpack 的一个 api，接收三个参数 `directory`,`useSubdirectories`,`regExp`

directory - 指定目录

useSubdirectories - 是否递归检索子目录

regExp - 匹配文件名的正则

## 注册当前文件夹下所有非 `index.js`的文件

```js
const requirePlugins = require.context('./', false, /(?<!index)\.js$/);
const removePrefix = str => {
  return str.replace(/^\.\//, '');
};
requirePlugins.keys().forEach(fileName => {
  //   console.log(requirePlugins(fileName).default);
  const name = removePrefix(fileName);
  import(`./${name}`);
});
```

## 注册 Vuex module(Vue3)

```js
// src/store/index.js
import { createStore } from 'vuex';
const modulesFiles = require.context('./modules', false, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});
export default createStore({
  modules,
});
```
