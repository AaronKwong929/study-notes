function myInstanceOf(instance, parent) {
  if (typeof instance !== `object` && typeof instance !== `function`)
    return false;
  let proto = instance.__proto__ || null;
  while (proto) {
    if (proto === null) return false;
    if (proto === parent.prototype) return true;
    proto = proto.__proto__;
  }
  return false;
}

console.log(myInstanceOf([], Array)); // => true

console.log(myInstanceOf([], Object)); // => true

console.log(myInstanceOf(x => x, Object)); // => true

console.log(myInstanceOf(``, Object)); // => false
