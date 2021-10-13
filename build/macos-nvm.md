# 在 MacOS 下安装 nvm

> 先去[官网](https://github.com/nvm-sh/nvm)看看情况，一般的安装都能搞掂，官网不推荐用 brew 安装

![](https://raw.githubusercontent.com/AaronKwong929/pictures/master/20211013093734.png)

## 安装过程

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

然后打开`~/.nvm`文件夹

```bash
vim .bash_profile
```

复制下面内容，保存退出

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

```bash
source .bash_profile
```

安装完成，输入`nvm`就可以正常显示内容

## 查看 `node` 版本

```bash
nvm ls-remote # 查看远程有哪些 node 版本

nvm ls # 查看本地有哪些 node 版本

nvm install xxxx # xxxx 是 ls-remote 的版本名

nvm use xxx # xxx 是 ls 的版本名
```
