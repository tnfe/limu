/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Tencent Corporation. All rights reserved.
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { isObject, isMap, isSet, noop, isPrimitive } from '../support/util';
import { proxyItemFnKeys, oppositeOps } from '../support/consts';
import { DraftMeta, ObjectLike } from '../inner-types';
import { getDraftMeta, markModified, newMeta } from './meta'
import { makeCopyWithMeta } from './copy'


export function createScopedMeta(baseData: any, options) {
  const { finishDraft = noop, ver, traps, parentMeta, key } = options;
  const meta = newMeta(baseData, { finishDraft, ver, parentMeta, key });

  const copy = makeCopyWithMeta(baseData, meta);
  meta.copy = copy;
  const ret = Proxy.revocable(copy, traps);
  meta.proxyVal = ret.proxy;
  meta.revoke = ret.revoke;

  return meta;
}

export function shouldGenerateProxyItems(parentType, key) {
  // !!! 对于 Array，直接生成 proxyItems
  if (parentType === 'Array') return true;
  const fnKeys = proxyItemFnKeys[parentType] || [];
  return fnKeys.includes(key);
}

export function getUnProxyValue(value) {
  if (!isObject(value)) {
    return value;
  }

  const valueMeta = getDraftMeta(value);
  if (!valueMeta) return value;

  return valueMeta.copy;
}

export function deepFreeze<T extends ObjectLike>(obj: T) {
  if (isPrimitive(obj)) {
    return obj;
  }

  // @ts-ignore
  if (Array.isArray(obj) && obj.length > 0) {
    obj.forEach(item => {
      deepFreeze(item);
    });
    return Object.freeze(obj);
  }

  if (isSet(obj)) {
    const set = obj as Set<any>;
    // TODD: throw error 'do not mutate' ?
    set.add = () => set;
    set.delete = () => false;
    set.clear = noop;
    return Object.freeze(obj);
  }
  if (isMap(obj)) {
    const map = obj as Map<any, any>;
    // TODD: throw error 'do not mutate' ?
    map.set = () => map;
    map.delete = () => false;
    map.clear = noop;
    return Object.freeze(obj);
  }

  // get all properties
  const propertyNames = Object.getOwnPropertyNames(obj);
  // 遍历
  propertyNames.forEach(name => {
    const value = obj[name];
    if (value instanceof Object && value !== null) {
      deepFreeze(value);
    }
  })
  return Object.freeze(obj);
}

export function recordPatch(options: { meta: DraftMeta, [key: string]: any }) {
  // TODO: to be implement in the future
  noop(options, oppositeOps);
}

/**
 * 拦截 set delete clear add
 * 支持用户使用 callback 的第三位参数 (val, key, mapOrSet) 的 mapOrSet 当做 draft 使用
 */
export function replaceSetOrMapMethods(
  mapOrSet: any, meta: DraftMeta,
  options: { dataType: 'Map' | 'Set', patches: any[], inversePatches: any[], usePatches: boolean },
) {
  const { dataType } = options;
  // 拦截 set delete clear add，注意 set，add 在末尾判断后添加
  // 支持用户使用 callback 的第三位参数 (val, key, map) 的 map 当做 draft 使用
  const oriDel = mapOrSet.delete.bind(mapOrSet);
  const oriClear = mapOrSet.clear.bind(mapOrSet);

  mapOrSet.delete = function limuDelete(...args) {
    markModified(meta);
    return oriDel(...args);
  };
  mapOrSet.clear = function limuClear(...args) {
    markModified(meta);
    return oriClear(...args);
  };

  if (dataType === 'Set') {
    const oriAdd = mapOrSet.add.bind(mapOrSet);
    mapOrSet.add = function limuAdd(...args) {
      markModified(meta);
      // recordPatch({ meta, ...options });
      return oriAdd(...args);
    };
  }

  if (dataType === 'Map') {
    const oriSet = mapOrSet.set.bind(mapOrSet);
    mapOrSet.set = function limuSet(...args) {
      markModified(meta);
      // recordPatch({ meta, ...options });
      // @ts-ignore
      return oriSet(...args);
    };
  }
}
