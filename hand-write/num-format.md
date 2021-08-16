# 实现千分位隔符

```js
function numFormat(num) {
  num = num.toString().split(`.`);
  let res = [];
  let temp = num[0].split(``).reverse();
  for (let i = 0; i < temp.length; i++) {
    if (i % 3 === 0 && i !== 0) res.unshift(`,`);
    res.unshift(temp[i]);
  }
  if (num[1]) res = res.concat('.' + num[1]);
  return res.join(``);
}

var a = 12345.678;

console.log(numFormat(a));
```

正则

```js
function numFormat(num) {
  var res = num.toString().replace(/\d+/, function (n) {
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ',';
    });
  });
  return res;
}

var a = 1234567894532;
var b = 673439.4542;
console.log(numFormat(a)); // "1,234,567,894,532"
console.log(numFormat(b)); // "673,439.4542"
```
