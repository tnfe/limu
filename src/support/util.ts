import { objDesc, arrDesc, mapDesc, setDesc, fnDesc } from './consts';

const toString = Object.prototype.toString;

export function noop(...args: any[]) {
  return args;
}

export function isObject(val) {
  // 注意，null 是 [object Null]
  return toString.call(val) === objDesc;
}

export function isMap(val) {
  return toString.call(val) === mapDesc;
}

export function isSet(val) {
  return toString.call(val) === setDesc;
}

export function isFn(val) {
  return toString.call(val) === fnDesc;
}

export function getValStrDesc(val) {
  return toString.call(val);
}

export function isPrimitive(val) {
  const desc = toString.call(val);
  return ![objDesc, arrDesc, mapDesc, setDesc, fnDesc].includes(desc);
}

export function isPromiseFn(obj) {
  return obj.constructor.name === 'AsyncFunction' || 'function' === typeof obj.then;
}

export function canHaveProto(val) {
  return !isPrimitive(val);
}

export function canBeNum(val) {
  return /^[0-9]*$/.test(val);
}

export function isSymbol(maySymbol) {
  return typeof maySymbol === 'symbol';
}
