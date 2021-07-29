# 构建

> 参考了尤大 vue-next 的 scripts/release.js，写一个适用于项目的构建发版脚本

**适用于开发分支合并到 dev 分支**

## 构建流程

开发分支合并到 dev 的完整流程

![](https://raw.githubusercontent.com/AaronKwong929/pictures/master/20210728161623.png)

整个流程需要的命令行

```bash
git add .
git commit -m "xxx"
git push
git checkout dev
git pull
git merge xxx
git commit -m "xxxx"
git push
git checkout xxx
```

上述过程容易漏的就是 dev 拉取更新，以及构建完成后没有把分支切回功能分支

将上述过程封装成一个工具方法，尽可能减少部署出错，配合 commitizen 规范化 commit message

## 遇到的问题

在 windows10 下 `git push` 之后会导致 chalk 丢失颜色

### 猜测原因

win10 的系统问题，run 函数的 pipe 模式会丢失和父进程的 IO 交互，具体表现为 git-cz 无法进行操作，只能打印出来

关于 inherit 和 pipe 的解释

![](https://raw.githubusercontent.com/AaronKwong929/pictures/master/20210729094409.png)

pipe 具体要怎么处理通信暂时还没有摸索明白

### 解决方案(暂时)

macOS 下无需解决方案，不会复现该问题

win10 下执行 git push 使用 pipe 模式（git push 不需要和父进程共用 IO

## 完整代码

```js
const chalk = require('chalk');
const execa = require('execa');

const step = msg =>
  console.log(chalk.bgYellowBright(chalk.black(`STEP: ${msg}`)));
const success = msg =>
  console.log(chalk.bgGreenBright(chalk.black(`SUCCESS: ${msg}`)));
const notice = msg =>
  console.log(chalk.bgYellow(chalk.black(`NOTICE: ${msg}`)));
const error = msg =>
  console.log(chalk.bgRedBright(chalk.black(`ERROR: ${msg}`)));

const run = (bin, args = [], opts = { stdio: `inherit` }) =>
  execa(bin, args, opts);

const getGitBranch = () =>
  execa.commandSync(`git rev-parse --abbrev-ref HEAD`).stdout;

async function main() {
  if ([`master`, `dev`].includes(currentBranch)) {
    error(`当前处在 ${currentBranch} 分支，请切换到功能分支`);
    return;
  }

  const { stdout } = await run(`git`, [`diff`], { stdio: `pipe` });
  if (stdout) {
    step(`添加 git 追踪`);
    await run(`git`, [`add`, `.`]);
    await run(`git-cz`);
  } else notice(`没有更新的文件`);

  await run(`git`, [`push`]); // win 下使用 inherit 会导致 chalk 丢失颜色，要使用pipe解决；macOS 下不会发生这个问题
  step(`切换到 dev 分支并拉取最新代码`);
  await run(`git`, [`checkout`, `dev`]);
  await run(`git`, [`pull`, `origin`, `dev`]);
  success(`拉取 dev 分支代码完成`);

  step(`合并到 dev`);
  await run(`git`, [`merge`, currentBranch]);
  success(`合并到 dev 分支完成`);
  step(`推送到远端`);
  await run(`git`, [`push`]); // win 下使用 inherit 会导致 chalk 丢失颜色，要使用pipe解决；macOS 下不会发生这个问题
  success(`推送 dev 完成，稍后 Jenkins 将启动构建并通知`);
  return;
}

const currentBranch = getGitBranch();

main()
  .catch(err => error(err))
  .finally(async () => {
    step(`切换回到 ${currentBranch} 分支`);
    await run(`git`, [`checkout`, currentBranch]);
  });
```
