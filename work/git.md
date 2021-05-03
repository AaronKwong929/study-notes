# 工作中使用的 git 流程小记

```bash
# 查看当前 git 用户
git config user.name
# 设置全局账号，这里用公司的
git config --global user.name "xxx"
git config --global user.email "xxx@xx.com"
```

```bash
# 更改当前仓库环境的账户
git config user.name "aaa"
git config user.email "aaa@aa.com"

# 添加远程仓库
git remote add origin xxxxxxx.git

# （从当前分支）创建并切换到一个分支
git checkout -b dev

# 本地创建的分支关联远程仓库
git push --set-upstream origin dev

# 本地删除分支
git branch -d <branch>

# 强制删除未合并完整的分支
git branch -D <branch>

# 删除远端分支
git push origin :<branch>

# 切换分支
git checkout master

# 拉取更新
git pull

# 本地分支和远程分支建立联系
git branch --set-upstream-to=origin/master master

# 创建标签
git tag -a "标签名字" -m "标签message"

# 推送标签到远端仓库
git push origin "标签名字"

# 删除标签
git tag -d "标签名字"

# 在远端仓库删除标签
git push origin --delete "标签名字"

# 本地更新 branch 列表
git remote update origin --prune
```

## 从远端拉取一个分支下来

1. git checkout -b <branch>
2. git pull origin <branch>
3. git branch --set-upstream-to=origin/<branch>

或者

1. git checkout -b <branch>
2. git branch --set-upstream-to=origin/<branch>
3. git pull

---

## 版本发布流程

1. git checkout master
2. git pull
3. 修改冲突
4. 切到 dev
5. git merge master
6. 修改冲突
7. 提交更改 & push
8. pull request
9. 通过后设置标签 git tag
10. git push origin "<tagname>"

---

## 修复生产环境 bug

1. 从 master 拉 hotFix 分支 git checkout -b hotfix-2.6.0 master
2. 修复代码后 git commit -m "Fixed severe production problem"
3. git push --set-upstream origin bugfix
4. 打包后重新上线，确认没问题后 merge 到主干: 在网页 master pull request 合并到主干
5. 合并完成后将改动合并到 dev 分支
6. 确认没问题后 merge 到主干: 在网页 master pull request 合并到主干
7. git checkout dev
8. git cherry-pick <hotfix-2.6.0 的版本号>

## 撤销一次 push

1. git log 查看需要回退到的版本
2. git reset --hard <版本号>
3. git push -f origin master 强推
