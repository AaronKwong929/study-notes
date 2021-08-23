# AMD, CMD, CJS, UMD 等的区别

- AMD ==> define() 推崇依赖前置 提前执行

- CMD ==> define() 推崇依赖就近 延迟引入

- CJS - CommonJS

  - 所有代码都运行在模块作用域，不会污染全局作用域。

  - 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。

  - 要想让模块再次运行，必须清除缓存。

  - 模块加载的顺序，按照其在代码中出现的顺序。

  - 主要用于服务端编程，同步加载模块 -- 因此不适合浏览器端

  - `const abc = require('xx');`

  - `module.exports = value;`, `exports.xxx = value;`

- UMD 通用写法，amd 和 cjs 流行而不统一催生的方案

- ESM 即 ES6 的 esModule ==> `import { abc } from 'xxx';`
