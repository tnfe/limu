/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { AnyObject, DraftMeta, IApiCtx } from '../inner-types';
import { ARRAY, IS_RAW, MAP, PROXYITEM_FNKEYS, SET, PRIVATE_META } from '../support/consts';
import { isFn, isObject, isPrimitive, noop } from '../support/util';
import { mayMakeCopy } from './copy';
import { getDraftMeta, getSafeDraftMeta, markModified, newMeta } from './meta';
import { recordVerScope } from './scope';

export function createScopedMeta(key: any, baseData: any, options: any) {
  const { traps, immutBase, apiCtx, autoRevoke } = options;
  // new meta data for current data node
  const meta = newMeta(key, baseData, options);

  const copy = mayMakeCopy(baseData, options);
  meta.copy = copy;
  const dataNodeTraps = {
    ...traps,
    get: (parent: any, key: any) => {
      if (PRIVATE_META === key) {
        return meta;
      }
      return traps.get(parent, key);
    },
  };
  if (immutBase) {
    const ret = new Proxy(copy, dataNodeTraps);
    meta.proxyVal = ret;
    meta.revoke = noop;
  } else {
    const ret = Proxy.revocable(copy, dataNodeTraps);
    meta.proxyVal = ret.proxy;
    meta.revoke = autoRevoke ? ret.revoke : noop;
  }
  apiCtx.metaMap.set(copy, meta);
  apiCtx.metaMap.set(meta.proxyVal, meta);
  apiCtx.metaMap.set(meta.self, meta);

  return meta;
}

export function shouldGenerateProxyItems(parentType: any, key: any) {
  // !!! 对于 Array，直接生成 proxyItems
  if (parentType === ARRAY) return true;
  const fnKeys = PROXYITEM_FNKEYS[parentType] || [];
  return fnKeys.includes(key);
}

export function getMayProxiedVal(val: any, options: { parentMeta: DraftMeta } & AnyObject) {
  const { key, parentMeta, parent, parentType, apiCtx } = options;
  const mayCreateProxyVal = (val: any, inputKey?: string) => {
    const key = inputKey || '';
    if (isPrimitive(val) || !val) {
      return val;
    }

    if (!parentMeta) {
      throw new Error('[[ createMeta ]]: meta should not be null');
    }

    if (!isFn(val)) {
      if (
        // 是一个全新的节点，不必生成代理，以便提高性能
        parentMeta.newNodeStats[key] ||
        // 已被 markRaw 标记，不需转为代理
        val[IS_RAW]
      ) {
        return val;
      }

      let valMeta = getSafeDraftMeta(val, apiCtx);

      // 惰性生成代理对象和其元数据
      if (!valMeta) {
        valMeta = createScopedMeta(key, val, options);
        recordVerScope(valMeta);
        // child value 指向 copy
        if (parentMeta.selfType === MAP) {
          parent.set(key, valMeta.copy);
        } else {
          parent[key] = valMeta.copy;
        }
      }
      return valMeta.proxyVal;
    }

    if (!shouldGenerateProxyItems(parentType, key)) {
      return val;
    }

    if (parentMeta.proxyItems) {
      return val;
    }

    // 提前完成遍历，为所有 item 生成代理
    let proxyItems: any = [];
    if (parentType === SET) {
      const tmp = new Set();
      (parent as Set<any>).forEach((val) => tmp.add(mayCreateProxyVal(val)));
      replaceSetOrMapMethods(tmp, parentMeta, {
        dataType: SET,
        apiCtx,
      });
      proxyItems = tmp;

      // 区别于 2.0.2 版本，这里提前把 copy 指回来
      parentMeta.copy = proxyItems;
    } else if (parentType === MAP) {
      const tmp = new Map();
      (parent as Map<any, any>).forEach((val, key) => tmp.set(key, mayCreateProxyVal(val, key)));
      replaceSetOrMapMethods(tmp, parentMeta, {
        dataType: MAP,
        apiCtx,
      });
      proxyItems = tmp;

      // 区别于 2.0.2 版本，这里提前把copy指回来
      parentMeta.copy = proxyItems;
    } else if (parentType === ARRAY && key !== 'sort') {
      parentMeta.copy = parentMeta.copy || parent.slice();
      proxyItems = parentMeta.proxyVal;
    }
    parentMeta.proxyItems = proxyItems;

    return val;
  };

  return mayCreateProxyVal(val, key);
}

export function getUnProxyValue(value: any, apiCtx: IApiCtx) {
  if (!isObject(value)) {
    return value;
  }

  const valueMeta = getSafeDraftMeta(value, apiCtx);
  if (!valueMeta) return value;

  return valueMeta.copy;
}

/**
 * 拦截 set delete clear add
 * 支持用户使用 callback 的第三位参数 (val, key, mapOrSet) 的 mapOrSet 当做 draft 使用
 */
export function replaceSetOrMapMethods(
  mapOrSet: any,
  meta: DraftMeta,
  options: {
    dataType: 'Map' | 'Set';
    apiCtx: any;
  },
) {
  const { dataType, apiCtx } = options;
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
      return oriAdd(...args);
    };
  }

  if (dataType === MAP) {
    const oriSet = mapOrSet.set.bind(mapOrSet);
    const oriGet = mapOrSet.get.bind(mapOrSet);
    mapOrSet.set = function limuSet(...args: any[]) {
      markModified(meta);
      if (meta.hasOnOperate) {
        const value = args[1];
        meta.rootMeta.execOnOperate('set', args[0], { mayProxyVal: value, value, parentMeta: meta });
      }
      // @ts-ignore
      return oriSet(...args);
    };

    mapOrSet.get = function limuGet(...args: any[]) {
      const mayProxyVal = oriGet(...args);
      if (meta.hasOnOperate) {
        const draftMeta = getDraftMeta(mayProxyVal, apiCtx);
        const value = draftMeta ? draftMeta.copy || draftMeta.self : mayProxyVal;
        meta.rootMeta.execOnOperate('get', args[0], { mayProxyVal, value, parentMeta: meta, isChanged: false });
      }
      return mayProxyVal;
    };
  }
}
