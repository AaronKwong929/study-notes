// const curry = (fn, ...args) =>
//     fn.length <= args.length
//         ? fn(...args)
//         : (..._args) => curry(fn, ...args, ..._args);

// const add = (a, b, c) => a + b + c;

// const add1 = curry(add);
// console.log(add1(1)(2)(3));
// console.log(add1(1)(2, 3));
// console.log(add1(1, 2)(3));
// console.log(add1(1, 2, 3));

function argsSum(args) {
    return args.reduce((pre, cur) => {
        return pre + cur;
    });
}
function add(...args1) {
    let sum1 = argsSum(args1);
    let fn = function (...args2) {
        let sum2 = argsSum(args2);
        return add(sum1 + sum2);
    };
    fn.toString = function () {
        return sum1;
    };
    return fn;
}
console.log(add(1, 2)(3)(4).toString());
