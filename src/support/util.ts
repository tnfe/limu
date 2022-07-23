/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Tencent Corporation. All rights reserved.
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { objDesc, arrDesc, mapDesc, setDesc, fnDesc } from './consts';

export const toString = Object.prototype.toString;

export function noop(...args: any[]) {
  return args;
}

export function isObject(val) {
  // attention，null desc is '[object Null]'
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


export function isPromiseResult(result: any) {
  return typeof Promise !== "undefined" && result instanceof Promise;
}


export function canHaveProto(val) {
  return !isPrimitive(val);
}


export function canBeNum(val) {
  var valType = typeof val;
  if (valType === 'number') return true;
  if (valType === 'string') return /^[0-9]*$/.test(val);
  return false;
}


export function isSymbol(maySymbol) {
  return typeof maySymbol === 'symbol';
}


export function isFrozenObj(mayObj) {
  if (mayObj && !isPrimitive(mayObj)) {
    return Object.isFrozen(mayObj);
  }
  return false;
}


export function safeMapGet(map: Map<string, any>, key: any) {
  let val = map.get(key)
  if (!val) {
    val = {};
    map[key] = val;
  }
  return val;
}


export function fastObjAssign(obj: any) {
  const newOne = {};
  Object.keys(obj).forEach(key => {
    newOne[key] = obj[key];
  });
  return newOne;
}
