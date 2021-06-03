import { objDesc, arrDesc, mapDesc, setDesc } from './consts';

const toString = Object.prototype.toString;



export function isObject(val) {
  return toString.call(val) === objDesc;
}

export function isMap(val) {
  return toString.call(val) === mapDesc;
}

export function isSet(val) {
  return toString.call(val) === setDesc;
}

export function isPrimitive(val) {
  const desc = toString.call(val);
  return ![objDesc, arrDesc, mapDesc, setDesc].includes(desc);
}

export function isPromiseFn(obj) {
  return obj.constructor.name === 'AsyncFunction' || 'function' === typeof obj.then;
}

export function canHaveProto(val) {
  return !isPrimitive(val);
}

