```js
export const composePromise = (...args) => {
  const init = args.pop();
  return function (...arg) {
    return args.reverse().reduce((sequence, func) => {
      return sequence.then(result => {
        // eslint-disable-next-line no-useless-call
        return func.call(null, result);
      });
    }, Promise.resolve(init.apply(null, arg)));
  };
};

export const composePromise = (...args) => {
  const init = args.pop();
  return (...arg) => {
    return args.reduce((sequence, func) => {
      return sequence.then(result => {
        // eslint-disable-next-line no-useless-call
        return func.call(null, result);
      });
    }, Promise.resolve(init.apply(null, arg)));
  };
};
```
