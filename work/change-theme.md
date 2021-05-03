# Vue + Vuex + LocalStorage + ElementUI 一键切换主题

## 操作步骤

1. 前往 ElementUI 官网右上角定制样式后下载 css 文件

（fonts 也要丢到对应目录下

2. 另开一个工程目录将 gulp 直接引入

```bash
npm install -g gulp
npm install -D gulp gulp-clean-css gulp-css-wrap
```

3. 新建 gulpfile.js

```js
// gulpfile.js
var path = require("path");
var gulp = require("gulp");
var cleanCSS = require("gulp-clean-css");
var cssWrap = require("gulp-css-wrap");
gulp.task("css-wrap", function () {
  return (
    gulp
      .src(path.resolve("./index-theme-dark.css"))
      /* 找需要添加命名空间的css文件，支持正则表达式 */
      .pipe(
        cssWrap({
          selector: ".custom-dark" /* 添加的命名空间 */,
        })
      )
      .pipe(cleanCSS())
      .pipe(gulp.dest("src")) /* 输出目录 */
  ); /* 存放的目录 */
});
```

4. 执行 gulp

```bash
gulp css-wrap
```

5. 得到文件后放入项目中，记得 fonts 文件夹要放在样式文件同级目录下，main.js 引入

6. 项目中全局切换主题 -> Vuex + localStorage 持久化存储

7. 函数分发

```js
// /src/util/change-theme.js
export const toggleClass = (element, className) => {
  element.className = className;
  localStorage.setItem("@admin_config_mode", className);
};
```

### 单文件引入

```js
import { toggleClass } from "@/util/change-theme";
export default {
  computed: {
    className: {
      get() {
        return this.$store.state.className;
      },
      set(val) {
        this.$store.state.className = val;
      },
    },
  },
  methods: {
    toggle() {
      this.$store.state.className = this.className;
      return toggleClass(document.body, this.$store.state.className);
    },
  },
};
```
