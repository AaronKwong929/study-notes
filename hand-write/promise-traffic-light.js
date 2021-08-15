function red() {
  console.log('red');
}
function green() {
  console.log('green');
}
function yellow() {
  console.log('yellow');
}

const light = (timer, cb) =>
  new Promise(resolve =>
    setTimeout(() => {
      cb();
      resolve();
    }, timer)
  );

const step = () =>
  Promise.resolve()
    .then(() => light(3000, red))
    .then(() => light(2000, yellow))
    .then(() => light(1000, green))
    .then(() => step());

step();
