/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { DataType, FastModeRange, IApiCtx, ObjectLike } from '../inner-types';
import { ARRAY } from '../support/consts';
import { isMap, isObject, isPrimitive, isSet } from '../support/util';
import { attachMeta } from './meta';

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

/**
 * 尝试生成copy
 * @param val
 * @returns
 */
export function tryMakeCopy(val: any, options: { parentType: DataType; fastModeRange: FastModeRange }) {
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
    apiCtx: IApiCtx;
    parentType: DataType;
    fastModeRange: FastModeRange;
    immutBase: boolean;
  },
) {
  const { apiCtx, immutBase } = options;
  // LABEL: FIX IMMUT MEM LEAK
  if (immutBase) {
    return { copy: ori, fast: false };
  }

  const { copy, fast } = tryMakeCopy(ori, options);
  attachMeta(copy, meta, { apiCtx, fast });
  return { copy, fast };
}
