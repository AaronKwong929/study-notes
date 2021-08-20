function pAjax(url) {
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

pAjax(`https://baidu.com`).then(
  res => {
    console.log(res);
  },
  err => {
    console.log(err);
  }
);
