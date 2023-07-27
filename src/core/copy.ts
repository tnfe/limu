/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { FastModeRange, ObjectLike } from '../inner-types';
import { ARRAY } from '../support/consts';
import { isMap, isObject, isPrimitive, isSet } from '../support/util';
import { attachMeta, getDraftMeta } from './meta';

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

/**
 * 尝试生成copy
 * @param val
 * @returns
 */
export function tryMakeCopy(val: any, options: { parentType; fastModeRange: FastModeRange }) {
  const { parentType, fastModeRange } = options;

  if (Array.isArray(val)) {
    return { copy: val.slice(), fast: false };
  }

  const fast = (fastModeRange === 'array' && parentType === ARRAY) || fastModeRange === 'all';
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

  return { copy, fast };
}

// 调用处已保证 meta 不为空
export function makeCopyWithMeta(
  ori: any,
  meta: any,
  options: {
    parentType: string;
    fastModeRange: FastModeRange;
    immutBase: boolean;
  },
) {
  if (!options.immutBase) {
    const { copy, fast } = tryMakeCopy(ori, options);
    return attachMeta(copy, meta, fast);
  }
  return attachMeta(ori, meta, false);
}
