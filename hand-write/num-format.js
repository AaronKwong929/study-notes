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
