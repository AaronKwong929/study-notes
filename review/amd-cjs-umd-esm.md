# AMD, CMD, CJS, UMD 等的区别

AMD ==> define() 推崇依赖前置 提前执行

CMD ==> define() 推崇依赖就近 延迟引入

CJS CommonJS `const abc = require('xx');` `module.exports = {}`,常见于 Node

UMD 通用写法，amd 和 cjs 流行而不统一催生的方案

ESM 即 ES6 的 esModule ==> `import { abc } from 'xxx';`
