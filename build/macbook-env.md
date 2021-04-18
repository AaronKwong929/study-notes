# MacBook 开发环境搭建

## 安装应用提示“无法验证开发者”

```cmd
sudo spctl --master-disable
```

## 终端走梯子

找到自己梯子的端口并记下来

打开终端

```bash
vim ~/.zshrc
```

粘贴以下内容

```vim
# proxy list
alias proxy='export all_proxy=socks5://127.0.0.1:1080'
alias unproxy='unset all_proxy'

# 然后输入
:wq
```

然后启用自己的梯子

```bash
# 查看当前网络环境
curl cip.cc

# 打开代理
proxy

# 再次查看当前网络环境
curl cip.cc

# 应该是梯子后的网络环境

# 关闭代理
unproxy

# 再查看当前网络环境
curl cip.cc
```

## 安装 homebrew

参考[这里](https://zhuanlan.zhihu.com/p/111014448)

```bash
# 或者复制粘贴这个
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"

# 后续环境和奇奇怪怪的东西都可以通过 brew 或者 brew-cask 安装
# brew-cask 安装可视类应用
```

## git

```cmd
git config --global user.name ""
git config --global user.email ""
```

## gen key（不知道当时写的什么 后续补

```bash
ssh-keygen -t rsa -C ""

cat .ssh/id_rsa.pub

# 复制丢到 github
ssh -T xxxxxxx@github.com
```
