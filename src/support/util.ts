/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { DataType } from '../inner-types'
import { OBJ_DESC, ARR_DESC, MAP_DESC, SET_DESC, FN_DESC, desc2dataType } from './consts';

export const toString = Object.prototype.toString;

export function noop(...args: any[]) {
  return args;
}

export function isObject(val: any) {
  // attention，null desc is '[object Null]'
  return toString.call(val) === OBJ_DESC;
}

export function isMap(val: any) {
  return toString.call(val) === MAP_DESC;
}

export function isSet(val: any) {
  return toString.call(val) === SET_DESC;
}

export function isFn(val: any) {
  return toString.call(val) === FN_DESC;
}

export function getValStrDesc(val: any) {
  return toString.call(val);
}

export function getDataType(dataNode: any) : DataType {
  var strDesc = getValStrDesc(dataNode);
  const dataType = desc2dataType[strDesc];
  return dataType;
}

export function isPrimitive(val: any) {
  const desc = toString.call(val);
  return ![OBJ_DESC, ARR_DESC, MAP_DESC, SET_DESC, FN_DESC].includes(desc);
}

export function isPromiseFn(obj: any) {
  return obj.constructor.name === 'AsyncFunction' || 'function' === typeof obj.then;
}

export function isPromiseResult(result: any) {
  return typeof Promise !== "undefined" && result instanceof Promise;
}

export function canBeNum(val: any) {
  var valType = typeof val;
  if (valType === 'number') return true;
  if (valType === 'string') return /^[0-9]*$/.test(val);
  return false;
}

export function isSymbol(maySymbol: any) {
  return typeof maySymbol === 'symbol';
}

const descProto: Record<string, any> = {
  [OBJ_DESC]: Object.prototype,
  [ARR_DESC]: Array.prototype,
  [MAP_DESC]: Map.prototype,
  [SET_DESC]: Set.prototype,
  [FN_DESC]: Function.prototype,
};

export function injectMetaProto(rawObj: any) {
  const desc = toString.call(rawObj);
  const rootProto = descProto[desc] || Object.prototype;
  const heluxObj = Object.create(null);
  Object.setPrototypeOf(heluxObj, rootProto);
  Object.setPrototypeOf(rawObj, heluxObj);
  return rawObj;
}
