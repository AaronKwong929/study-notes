# 记录 Electron 遇到的坑

> 邝俊灏 2021-03-22 补回

## 启动 electron 项目时报错

```bash
NPM Error：gyp: No Xcode or CLT version detected!
xcode-select --install

# 提示以下信息
xcode-select: error: command line tools are already installed, use "Software Update" to install updates
```

这个是 xcode 安装不完整，解决方法如下

```bash
sudo rm -rf $(xcode-select -print-path)
xcode-select --install

vue add vue-cli-plugin-electron-builder
# 选最新版本
```

## Uncaught Refrence Error \_\_dirname is not defined

```js
// vue.config.js;
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  },
};
```
