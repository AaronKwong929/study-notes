const sleep = seconds => new Promise(resolve => setTimeout(resolve, seconds));
sleep(3000).then(() => {
  console.log(111);
});

const delay = (func, seconds, ...args) =>
  new Promise(resolve =>
    setTimeout(() => Promise.resolve(func(...args)).then(resolve), seconds)
  );

delay(
  str => {
    console.log(str);
    return str;
  },
  3000,
  `hello world`
).then(res => console.log(res));

