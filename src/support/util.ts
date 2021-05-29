
const toString = Object.prototype.toString;
const objDesc = '[object Object]';
const arrDesc = '[object Array]';

export function isObject(val) {
  return toString.call(val) === '[object Object]';
}

export function isPrimitive(val) {
  const desc = toString.call(val);
  return ![objDesc, arrDesc].includes(desc);
}

export function isPromiseFn(obj) {
  return obj.constructor.name === 'AsyncFunction' || 'function' === typeof obj.then;
}

export function canHaveProto(val) {
  return !isPrimitive(val);
}

