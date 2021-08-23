# 获取 url 的指定参数

```js
function getUrlParams(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, `i`);
  const search = window.location.search.substr(1).match(reg);
  if (search) return unescape(search[2]);
  return null;
}
```

`(^|&)`匹配第一个`&`

`=([^&]*)`表示匹配等号后面不为`&`的内容

`(&|%)`匹配最后一个&

`search`没有命中值就是`undefined`，命中了的话`["name=elephant&", "", "elephant", "&"]`，所以取`索引 2`
