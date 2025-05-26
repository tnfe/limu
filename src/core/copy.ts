/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { ObjectLike } from '../inner-types';
import { isMap, isObject, isPrimitive, isSet } from '../support/util';

export function deepCopy<T = ObjectLike>(obj: T): T {
  const innerDeep = (obj: any) => {
    if (isPrimitive(obj)) {
      return obj;
    }

    // TODO: 或许这里通过 metaVer 能够解决多引用问题 ( see 3.4.2 )
    // TODO: 传入参数 reuse，确定是否走逻辑查看 meta.modified，并复用 meta.copy or meta.self

    let newNode = obj;
    if (Array.isArray(obj)) {
      newNode = obj.slice();
      newNode.forEach((item: any, idx: number) => {
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
      Object.keys(obj).forEach((key) => {
        newNode[key] = innerDeep(obj[key]);
      });
    }
    return newNode;
  };

  return innerDeep(obj);
}

export function makeCopy(val: any) {
  if (Array.isArray(val)) {
    return val.slice();
  }
  if (isObject(val)) {
    return { ...val };
  }
  if (isMap(val)) {
    return new Map(val);
  }
  if (isSet(val)) {
    return new Set(val);
  }
  return val;
}

/**
 * 尝试生成copy
 * @param val
 * @returns
 */
export function tryMakeCopy(val: any, readOnly?: boolean) {
  if (readOnly) {
    return val;
  }

  if (Array.isArray(val)) {
    return val.slice();
  }

  let copy = val;
  if (val && isObject(val)) {
    copy = { ...val };
  }
  if (isMap(val)) {
    copy = new Map(val);
  }
  if (isSet(val)) {
    copy = new Set(val);
  }

  return copy;
}

// 调用处已保证 meta 不为空
export function mayMakeCopy(
  ori: any,
  options: {
    immutBase: boolean;
    readOnly: boolean;
  },
) {
  // LABEL: SEE IF IMMUT HAS MEM LEAK
  if (options.immutBase) {
    return ori;
  }

  const copy = tryMakeCopy(ori, options.readOnly);
  return copy;
}
