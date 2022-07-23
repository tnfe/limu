/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Tencent Corporation. All rights reserved.
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { isObject, isMap, isSet, getValStrDesc, noop, isPrimitive } from '../support/util';
import { desc2dataType, proxyItemFnKeys, oppositeOps } from '../support/consts';
import { DraftMeta, ObjectLike } from '../inner-types';
import { getDraftMeta } from './meta'


export function shouldGenerateProxyItems(parentType, key) {
  // !!! 对于 Array，直接生成 proxyItems
  if (parentType === 'Array') return true;
  const fnKeys = proxyItemFnKeys[parentType] || [];
  return fnKeys.includes(key);
}


export function getKeyPath(draftNode, curKey) {
  const pathArr = [curKey];
  const meta = getDraftMeta(draftNode);
  if (meta && meta.level > 0) {
    const { keyPath } = meta;
    return [...keyPath, curKey];
  }
  return pathArr;
}


export function getUnProxyValue(value) {
  if (!isObject(value)) {
    return value;
  }

  const valueMeta = getDraftMeta(value);
  if (!valueMeta) return value;

  return valueMeta.copy;
}


export function getDataNodeType(dataNode) {
  var strDesc = getValStrDesc(dataNode);
  const dataType = desc2dataType[strDesc];
  return dataType;
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


export function markModified(mapSetMeta: DraftMeta) {
  mapSetMeta.rootMeta.modified = true;
  const doMark = (meta: DraftMeta | null) => {
    if (meta) {
      meta.modified = true;
      doMark(meta.parentMeta);
    }
  };

  doMark(mapSetMeta);
};


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


