# Promise 实现 AJAX

```js
function myAjax(url) {
  let promise = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(`GET`, url);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) return;
      if (this.status === 200) resolve(this.response);
      else reject(new Error(this.statusText));
    };
  });
  return promise;
}

// 要在浏览器测试，node 没有 XMLHttpRequest
myAjax(`https://www.baidu.com`).then(
  res => {
    console.log(res);
  },
  err => {
    console.log(err);
  }
);
```

## 可以优化的点

method 传参校验
