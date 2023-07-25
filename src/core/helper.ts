/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { isObject, noop, isPrimitive, isFn } from '../support/util';
import { PROXYITEM_FNKEYS, oppositeOps, MAP, SET, ARRAY } from '../support/consts';
import { DraftMeta } from '../inner-types';
import { getDraftMeta, markModified, newMeta, attachMeta } from './meta'
import { makeCopyWithMeta } from './copy'
import { recordVerScope } from './scope'


export function createScopedMeta(baseData: any, options: any) {
  const { finishDraft = noop, ver, traps, parentType, parentMeta, key, fastModeRange, immutBase } = options;
  const meta = newMeta(baseData, { finishDraft, ver, parentMeta, key, immutBase });

  const copy = makeCopyWithMeta(baseData, meta, { parentType, fastModeRange, immutBase });
  meta.copy = copy;
  if (immutBase) {
    const ret = new Proxy(copy, traps);
    meta.proxyVal = ret;
    meta.revoke = noop;
  } else {
    const ret = Proxy.revocable(copy, traps);
    meta.proxyVal = ret.proxy;
    meta.revoke = ret.revoke;
  }

  return meta;
}

export function shouldGenerateProxyItems(parentType: any, key: any) {
  // !!! 对于 Array，直接生成 proxyItems
  if (parentType === ARRAY) return true;
  const fnKeys = PROXYITEM_FNKEYS[parentType] || [];
  return fnKeys.includes(key);
}


export function getProxyVal(selfVal: any, options: any) {
  const {
    key, parentMeta, ver, traps, parent, patches, inversePatches, usePatches,
    parentType, fastModeRange, immutBase, readOnly,
  } = options;

  const mayCreateProxyVal = (selfVal: any, inputKey?: string) => {
    if (isPrimitive(selfVal) || !selfVal) {
      return selfVal;
    }

    const key = inputKey || '';
    let valMeta = getDraftMeta(selfVal);

    if (!isFn(selfVal)) {
      // 惰性生成代理对象和其元数据
      if (!valMeta) {
        valMeta = createScopedMeta(selfVal, { key, parentMeta, parentType, ver, traps, fastModeRange, immutBase, readOnly });
        recordVerScope(valMeta);
        // child value 指向 copy
        parent[key] = valMeta.copy;
      }
      return valMeta.proxyVal;
    }

    if (!shouldGenerateProxyItems(parentType, key)) {
      return selfVal;
    }

    // valMeta = getDraftMeta(parent) as DraftMeta;
    if (!parentMeta) {
      throw new Error('[[ createMeta ]]: oops, meta should not be null');
    }

    if (parentMeta.proxyItems) {
      return selfVal;
    }

    // 提前完成遍历，为所有 item 生成代理
    let proxyItems: any = [];
    if (parentType === SET) {
      const tmp = new Set();
      (parent as Set<any>).forEach((val) => tmp.add(mayCreateProxyVal(val)));
      replaceSetOrMapMethods(tmp, parentMeta, { dataType: SET, patches, inversePatches, usePatches });
      proxyItems = attachMeta(tmp, parentMeta, fastModeRange);

      // 区别于 2.0.2 版本，这里提前把copy指回来
      parentMeta.copy = proxyItems;
    } else if (parentType === MAP) {
      const tmp = new Map();
      (parent as Map<any, any>).forEach((val, key) => tmp.set(key, mayCreateProxyVal(val, key)));
      replaceSetOrMapMethods(tmp, parentMeta, { dataType: MAP, patches, inversePatches, usePatches });
      proxyItems = attachMeta(tmp, parentMeta, fastModeRange);

      // 区别于 2.0.2 版本，这里提前把copy指回来
      parentMeta.copy = proxyItems;
    } else if (parentType === ARRAY && key !== 'sort') {
      parentMeta.copy = parentMeta.copy || parent.slice();
      proxyItems = parentMeta.proxyVal;
    }
    parentMeta.proxyItems = proxyItems;

    return selfVal;
  };

  return mayCreateProxyVal(selfVal, key);
};


export function getUnProxyValue(value: any) {
  if (!isObject(value)) {
    return value;
  }

  const valueMeta = getDraftMeta(value);
  if (!valueMeta) return value;

  return valueMeta.copy;
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

  mapOrSet.delete = function limuDelete(...args: any[]) {
    markModified(meta);
    return oriDel(...args);
  };
  mapOrSet.clear = function limuClear(...args: any[]) {
    markModified(meta);
    return oriClear(...args);
  };

  if (dataType === SET) {
    const oriAdd = mapOrSet.add.bind(mapOrSet);
    mapOrSet.add = function limuAdd(...args: any[]) {
      markModified(meta);
      recordPatch({ meta, ...options });
      return oriAdd(...args);
    };
  }

  if (dataType === MAP) {
    const oriSet = mapOrSet.set.bind(mapOrSet);
    mapOrSet.set = function limuSet(...args: any[]) {
      markModified(meta);
      recordPatch({ meta, ...options });
      // @ts-ignore
      return oriSet(...args);
    };
  }
}
