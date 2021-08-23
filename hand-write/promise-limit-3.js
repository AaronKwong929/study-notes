function solve(promises, limit) {
  const index = 0;
  const resArr = [];
  return new Promise(resolve => {
    const newFunc = (item, i) => {
      item()
        .then(
          data => {
            resArr[i] = data;
          },
          err => {
            resArr[i] = err;
          }
        )
        .finally(() => {
          if (index < promises.length - 1) {
            newFunc(promises[index]);
            index++;
          } else if (index === promises.length - 1) resolve(resArr);
        });
    };
    for (let i = 0; i < limit; i++) newFunc(promises[i], i);
  });
}
