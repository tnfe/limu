/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Tencent Corporation. All rights reserved.
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { ObjectLike } from '../inner-types';
import { isObject, isMap, isSet, isPrimitive } from '../support/util';
import { getDraftMeta, attachMeta } from './meta'


export function deepCopy<T extends ObjectLike>(obj: T, metaVer?: string): T {
  const innerDeep = (obj: any) => {
    if (isPrimitive(obj)) {
      return obj;
    }

    if (metaVer) {
      const meta = getDraftMeta(obj);
      const copy = meta?.copy;
      // 多引用导致的遗漏值，还原回来，此处注意跳过根对象判定
      if (copy && meta.level > 0) {
        return copy;
      }
    }

    let newNode = obj;
    if (Array.isArray(obj)) {
      newNode = obj.slice();
      newNode.forEach((item, idx) => {
        newNode[idx] = innerDeep(item);
      });
    }
    if (isSet(obj)) {
      const tmpArr = Array.from(obj);
      tmpArr.forEach((item, idx) => {
        tmpArr[idx] = innerDeep(item);
      });
      newNode = new Set(tmpArr);
    }
    if (isMap(obj)) {
      newNode = new Map(obj) as Map<string, any>;
      (newNode as Map<string, any>).forEach((value, key) => {
        newNode.set(key, innerDeep(value));
      });
    }
    if (isObject(obj)) {
      newNode = {};
      Object.keys(obj).forEach(key => {
        newNode[key] = innerDeep(obj[key]);
      });
    }
    return newNode;
  };

  return innerDeep(obj);
}

/**
 * 尝试生成copy
 * @param val 
 * @returns
 */
export function tryMakeCopy(val: any, throwErr?: boolean) {
  if (Array.isArray(val)) {
    return val.slice();
  }
  if (val && isObject(val)) {
    return { ...val };
  }
  if (isMap(val)) {
    return new Map(val);
  }
  if (isSet(val)) {
    return new Set(val);
  }
  if (throwErr) {
    throw new Error(`make copy err, type can only be object\(except null\) or array`);
  }

  return val;
}

// 调用处已保证 meta 不为空 
export function makeCopyWithMeta(ori: any, meta: any) {
  const ret: any = tryMakeCopy(ori, true);
  return attachMeta(ret, meta);
}
