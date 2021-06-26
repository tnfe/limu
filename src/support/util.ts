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

export function getValStrDesc(val) {
  return toString.call(val);
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

/**
 * 检查输入值是否能转化为数字且没有包含其他除.以外的非法字符
 * input: '22.s' ---> outpur: false
 * input: '22.1' ---> outpur: true
 * input: '22' ---> outpur: true
 * input: 22 ---> outpur: true
 * input: 22.1 ---> outpur: true
 * @param val 
 */
export function canBeNum(val) {
  const valType = typeof val;
  if (valType === 'string') {
    if (val.includes('.')) {
      const pureStr = val.replace(/\./g, '');
      // 去掉.之后，如果还包含有其他字符，则直接返回false
      if (!/^[1-9]+[0-9]*$/.test(pureStr)) return false;

      const parsed = parseFloat(val);
      return !Number.isNaN(parsed)
    } else if (val === "0") {
      return true;
    } else {
      return /^[1-9]+[0-9]*$/.test(val);
    }
  } else if (valType === 'number') {
    return true;
  }
  return false;
}


export function isSymbol(maySymbol) {
  return typeof maySymbol === 'symbol';
}
