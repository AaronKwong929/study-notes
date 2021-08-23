# uglify 原理

原理：通过将代码转换成 AST，再将这个 AST 转换成更小的 AST2，再将 AST2 转换回代码

完整的合并规则要去 uglify 官网看

`表达式语句`才会被合并

```js
function demo() {
  a();
  b();
  c();
}
```

会被转换成

```js
function demo() {
  a(), b(), c();
}
```

表达式：`a`,`b + 3`

```js
var a = 1;
var b = 2;
var x = { a: 1 }
```

会被转换成

```js
var a=1,b=2,x={a:1}
```

语句： `for(let i = 0; i < length; i++)`
