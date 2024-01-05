/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { AnyObject, DataType, Fn, ObjectLike, Primitive } from '../inner-types';
import { ARR_DESC, desc2dataType, FN_DESC, MAP_DESC, OBJ_DESC, SET_DESC, IS_RAW } from './consts';

export const toString = Object.prototype.toString;

const canUseReflect = !!Reflect;
const hasProp = Object.prototype.hasOwnProperty;

export function has(obj: any, key: any) {
  if (canUseReflect) {
    return Reflect.has(obj, key);
  }
  return hasProp.call(obj, key);
}

export function deepDrill<T extends ObjectLike>(obj: T, parentObj: any, key: any, subObjCb: (obj: any, parentObj: any, key: any) => void) {
  const innerDeep = (obj: any, parentObj: any, key: any) => {
    if (isPrimitive(obj)) {
      return;
    }
    subObjCb(obj, parentObj, key);

    // const drillThenCb = (obj: any, parentObj: any, key: any) => {
    //   innerDeep(obj, parentObj, key);
    //   subObjCb(obj, parentObj, key);
    // };

    if (Array.isArray(obj)) {
      obj.forEach((item: any, idx: number) => {
        innerDeep(item, obj, idx);
      });
    }
    // TODO 处理 set
    // if (isSet(obj)) {
    //   obj.forEach((item: any) => {
    //     subObjCb(item, obj, idx);
    //   });
    // }
    if (isMap(obj)) {
      obj.forEach((value: any, key: any) => {
        innerDeep(value, obj, key);
      });
    }
    if (isObject(obj)) {
      Object.keys(obj).forEach((key) => {
        innerDeep(obj[key], obj, key);
      });
    }
  };

  innerDeep(obj, parentObj, key);
}

export function getValStrDesc(val: any) {
  // return Array.isArray(val) ? ARR_DESC : toString.call(val);
  return toString.call(val);
}

export function noop(...args: any[]) {
  return args;
}

export function isObject(val: any): val is AnyObject {
  // attention，null desc is '[object Null]'
  return getValStrDesc(val) === OBJ_DESC;
}

export function isMap(val: any): val is Map<any, any> {
  return getValStrDesc(val) === MAP_DESC;
}

export function isSet(val: any): val is Set<any> {
  return getValStrDesc(val) === SET_DESC;
}

export function isFn(val: any): val is Fn {
  return getValStrDesc(val) === FN_DESC;
}

export function getDataType(dataNode: any): DataType {
  var strDesc = getValStrDesc(dataNode);
  const dataType = desc2dataType[strDesc];
  return dataType;
}

export function isPrimitive(val: any): val is Primitive {
  const desc = getValStrDesc(val);
  return ![OBJ_DESC, ARR_DESC, MAP_DESC, SET_DESC, FN_DESC].includes(desc);
}

export function isPromiseFn(obj: any) {
  return obj.constructor.name === 'AsyncFunction' || 'function' === typeof obj.then;
}

export function isPromiseResult(result: any) {
  return typeof Promise !== 'undefined' && result instanceof Promise;
}

export function canBeNum(val: any) {
  var valType = typeof val;
  if (valType === 'number') return true;
  if (valType === 'string') return /^[0-9]*$/.test(val);
  return false;
}

export function isSymbol(maySymbol: any): maySymbol is symbol {
  return typeof maySymbol === 'symbol';
}

/**
 * 是否已被 markRaw 标记
 */
export function isMardedRaw(val: any): boolean {
  if (!val) return false;
  return val[IS_RAW] ?? false;
}

const descProto: Record<string, any> = {
  [ARR_DESC]: Array.prototype,
  [MAP_DESC]: Map.prototype,
  [SET_DESC]: Set.prototype,
  [FN_DESC]: Function.prototype,
};

export function injectMetaProto(rawObj: any) {
  const desc = getValStrDesc(rawObj);
  const rootProto = descProto[desc] || Object.prototype;
  const pureObj = Object.create(null);
  Object.setPrototypeOf(pureObj, rootProto);
  Object.setPrototypeOf(rawObj, pureObj);
  return rawObj;
}
