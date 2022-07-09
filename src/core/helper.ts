/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Tencent Corporation. All rights reserved.
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { isObject, isMap, isSet, getValStrDesc, isFn, noop, canBeNum } from '../support/util';
import {
  desc2dataType, carefulType2fnKeys, carefulType2proxyItemFnKeys,
  carefulType2fnKeysThatNeedMarkModified,
} from '../support/consts';
import { metasKey, verKey, isModifiedKey } from '../support/symbols';
import { verWrap, ver2MetasList } from '../support/inner-data';
import { DraftMeta } from '../inner-types';


export function shouldGenerateProxyItems(parentType, key) {
  // !!! 对于 Array，直接生成 proxyItems
  if (parentType === 'Array') return true;
  const proxyItemFnKeys = carefulType2proxyItemFnKeys[parentType] || [];
  return proxyItemFnKeys.includes(key);
}


export function getKeyPath(mayContainMetaObj, curKey, metaVer) {
  const pathArr = [curKey];
  const meta = getMeta(mayContainMetaObj, metaVer);
  if (meta && meta.level > 0) {
    const { keyPath } = meta;
    return [...keyPath, curKey];
  }
  return pathArr;
}


export function getMeta(mayMetasProtoObj, metaVer): DraftMeta | null {
  const metas = getMetas(mayMetasProtoObj);
  if (metas) return metas[metaVer];
  return null;
}


export function getMetaForDraft(draft, metaVer) {
  if (!draft) return null;
  return getMeta(draft.__proto__, metaVer);
}

export function getMetas(mayMetasProtoObj) {
  if (!mayMetasProtoObj) return null;
  return mayMetasProtoObj[metasKey]
}


// 调用处已保证 meta 不为空
export function makeCopy(meta: DraftMeta, mayACopy?: any) {
  const metaOwner: any = meta.self;

  if (Array.isArray(metaOwner)) {
    return meta.proxyItems || metaOwner.slice();
  }
  if (isObject(metaOwner)) {
    return { ...metaOwner };
  }
  if (isMap(metaOwner)) {
    return (meta.proxyItems || mayACopy || new Map(metaOwner));
  }
  if (isSet(metaOwner)) {
    return (meta.proxyItems || mayACopy || new Set(metaOwner));
  }
  throw new Error(`data ${metaOwner} try trigger getCopy, its type is ${typeof meta}`)
}


/**
 * 尝试生成copy
 * @param val 
 * @returns 
 */
export function tryMakeCopy(val: any) {
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
  return val;
}


export function getUnProxyValue(value, metaVer) {
  const valueMeta = getMetaForDraft(value, metaVer);
  if (!valueMeta) return value;
  let copy = valueMeta.copy;
  if (!copy) {
    copy = makeCopy(valueMeta);
    valueMeta.copy = copy;
  }
  return copy;
}


// 外部已确保是obj
export function setMeta(obj, meta, metaVer) {
  const metas = getMetas(obj);
  metas && (metas[metaVer] = meta);
}


export function getMetaVer() {
  verWrap.value += 1;
  const metaVer = verWrap.value;
  ver2MetasList[metaVer] = [];
  return metaVer;
}


export function getNextMetaLevel(mayContainMetaObj, metaVer) {
  const meta = getMeta(mayContainMetaObj, metaVer);
  return meta ? meta.level + 1 : 1;
}

export function getRealProto(val) {
  const proto = Object.getPrototypeOf(val);
  // 防止 Object.create(null) 创建的对象没有原型链
  if (!proto) return Object.prototype;
  return Object.getPrototypeOf(val);
}


export function setMetasProto(val, realProto) {
  // 把 metas 放到单独的 __proto__ 层里，确保写入的数据不会污染 Object.prototype
  //  __proto__:
  //    Symbol('metas'): { ... }
  //    __proto__: Object | Array
  const metaProto = Object.create(null);
  Object.setPrototypeOf(metaProto, realProto);
  // 故意多写一层 __proto__ 容器
  Object.setPrototypeOf(val, metaProto);
  val.__proto__[metasKey] = {};
}


/**
 * 是否是 proxy 代理的草稿对象
 * @param mayDraft
 * @returns 
 */
export function isDraft(mayDraft) {
  const ver = mayDraft?.[verKey];
  return !!ver;
}


export function getDataNodeType(dataNode) {
  var strDesc = getValStrDesc(dataNode);
  const dataType = desc2dataType[strDesc];
  return dataType;
}


export function mayMarkModified(parentType: string, op: any, val: any, markModified: Function) {
  const fnKeys = carefulType2fnKeys[parentType] || [];
  if (fnKeys.includes(op) && isFn(val)) {
    const fnKeysThatNeedMarkModified = carefulType2fnKeysThatNeedMarkModified[parentType];
    if (fnKeysThatNeedMarkModified.includes(op)) {
      markModified();
    }
  }
}


export function reassignGrandpaAndParent(parentDataNodeMeta: DraftMeta, calledBy?: string, setKey?: string | number) {
  const {
    parentMeta: grandpaMeta, parentType, selfType,
    idx: parentDataNodeIdx, copy: parentDataNodeCopy,
  } = parentDataNodeMeta;

  // 数组操作比较特殊，有2种方式，包括了(1方法修改) 和 (2自身通过索引直接修改)，这里处理到第2种
  if (calledBy === 'set' && canBeNum(setKey) && selfType === 'Array') {
    const proxyItems = parentDataNodeMeta.proxyItems;
    if (proxyItems) {
      // @ts-ignore
      proxyItems[isModifiedKey] = true;
    }
  }

  if (!grandpaMeta) {
    return;
  };

  let grandpaCopy = grandpaMeta.copy;
  // 回溯过程中，为没拷贝体的爷爷节点生成拷贝对象
  if (!grandpaCopy) {
    grandpaCopy = makeCopy(grandpaMeta);
    grandpaMeta.copy = grandpaCopy;
  }

  let needMarkModified = false;

  // console.log(' ************ [[ DEBUG ]] reassignGrandpaAndParent for ' + parentType, ' ,K:', parentDataNodeIdx, ' ,V:', parentDataNodeCopy);
  if (parentType === 'Map') {
    (grandpaCopy as Map<any, any>).set(parentDataNodeIdx, parentDataNodeCopy);
    needMarkModified = true;
  } else if (parentType === 'Object') {
    (grandpaCopy as Record<any, any>)[parentDataNodeIdx] = parentDataNodeCopy;
  } else if (parentType === 'Array') {
    // 数组操作比较特殊，有2种方式，包括了1方法修改和2自身通过索引直接修改，这里处理到第1种
    (grandpaCopy as any[])[parentDataNodeIdx] = parentDataNodeCopy;
    needMarkModified = true;
  } else if (parentType === 'Set') {
    // Set 无法做 reassign，这里仅标记 needMarkModified，在 finishDraft 步骤里会最 Set的重计算
    needMarkModified = true;
  }

  const proxyItems = grandpaMeta.proxyItems;
  if (needMarkModified && proxyItems) {
    // @ts-ignore
    // proxyItems.__modified = true;
    proxyItems[isModifiedKey] = true;
    // @ts-ignore
    // !!! 方便在 finishDraft 里，遇到 Set 结构还可以指回来
    proxyItems.__parent = grandpaMeta.parentMeta?.copy;
    // @ts-ignore
    proxyItems.__dataIndex = grandpaMeta.idx;
  }

}


export function markRootModifiedAndReassign(meta: DraftMeta, parent, metaVer) {
  if (meta?.rootMeta) {
    meta.rootMeta.modified = true;
    const parentMeta = getMeta(parent, metaVer);
    if (parentMeta) {
      reassignGrandpaAndParent(parentMeta);
    }
  };
};


/**
 * 拦截 set delete clear add
 * 支持用户使用 callback 的第三位参数 (val, key, mapOrSet) 的 mapOrSet 当做 draft 使用
 */
export function replaceSetOrMapMethods(dataType: 'Map' | 'Set', mapOrSet: any, meta: DraftMeta, parent, metaVer) {
  // 拦截 set delete clear add，注意 set，add 在末尾判断后添加
  // 支持用户使用 callback 的第三位参数 (val, key, map) 的 map 当做 draft 使用
  const oriDel = mapOrSet.delete.bind(mapOrSet);
  const oriClear = mapOrSet.clear.bind(mapOrSet);
  mapOrSet.add = function limuAdd() {
    noop();
  };
  mapOrSet.set = function limuSet() {
    noop();
  };
  mapOrSet.delete = function limuDelete(...args) {
    markRootModifiedAndReassign(meta, parent, metaVer);
    return oriDel(...args);
  };
  mapOrSet.clear = function limuClear(...args) {
    markRootModifiedAndReassign(meta, parent, metaVer);
    return oriClear(...args);
  };

  if (dataType === 'Set') {
    const oriAdd = mapOrSet.add.bind(mapOrSet);
    mapOrSet.add = function limuAdd(...args) {
      markRootModifiedAndReassign(meta, parent, metaVer);
      return oriAdd(...args);
    };
  }

  if (dataType === 'Map') {
    const oriSet = mapOrSet.set.bind(mapOrSet);
    mapOrSet.set = function limuSet(...args) {
      markRootModifiedAndReassign(meta, parent, metaVer);
      return oriSet(...args);
    };
  }
}
