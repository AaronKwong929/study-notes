// 实现new
// 新建空对象
// 修改成ctor原型
// ctor apply obj args
// 判断输出是对象则直接返回，否则返回obj
function New(ctor, ...args) {
  const obj = {};
  obj.__proto__ = ctor.prototype;
  const res = ctor.apply(obj, args);
  return typeof res === `object` ? res : obj;
}
