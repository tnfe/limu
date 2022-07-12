/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Tencent Corporation. All rights reserved.
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import {
  getMetaVer,
  getMeta,
  getNextMetaLevel,
  setMeta,
  getKeyPath,
  getMetaForDraft,
  getDataNodeType,
  isDraft,
  shouldGenerateProxyItems,
  tryMakeCopy,
  makeCopy,
  replaceSetOrMapMethods,
  deepFreeze,
} from './helper';
import { finishHandler, verKey, isModifiedKey, metasKey } from '../support/symbols';
import { carefulDataTypes } from '../support/consts';
import { limuConfig } from '../support/inner-data';
import { isPrimitive, canBeNum, isFn, noop, isSymbol, isFrozenObj } from '../support/util';
import { copyAndGetDataNode, clearAllDataNodeMeta, ensureDataNodeMetasProtoLayer, ensureDataNodeMetasProtoLayerFast } from './data-node-processor';
import { ObjectLike, DraftMeta } from '../inner-types';


// size 直接返回，
// 避免 Cannot set property size of #<Map> which has only a getter
// 避免 Cannot set property size of #<Set> which has only a getter
const PROPERTIES_BLACK_LIST = ['length', 'constructor', 'asymmetricMatch', 'nodeType', 'size'];
const TYPE_BLACK_LIST = [carefulDataTypes.Array, carefulDataTypes.Set, carefulDataTypes.Map];
// 这些类型不关心 copy
const NO_CARE_COPY_TYPE_LIST = [carefulDataTypes.Set, carefulDataTypes.Map];

const unforzenDataMap = new Map();

const inner = {
  handleMap(rootMeta: DraftMeta, metaVer: number, final: any) {
    // @ts-ignore
    const mapProxyItemsList = rootMeta.proxyItemsMgr['Map'];
    let mayRootMap: Map<any, any> | null = null;
    // see test case:  /test/map-other/object-map.ts
    mapProxyItemsList.forEach(proxyItems => {
      // @ts-ignore, 在 reassignGrandpaAndParent 做了标记
      if (proxyItems[isModifiedKey]) {
        const tmpMap = new Map();
        mayRootMap = tmpMap;
        proxyItems.forEach((val, key) => {
          const meta = getMeta(val, metaVer);
          if (meta) {
            let toSetItem = !meta.modified ? meta.self : meta.copy;
            tmpMap.set(key, toSetItem);
          }
        });
        // @ts-ignore，指回来
        if (proxyItems.__parent) {
          // @ts-ignore
          proxyItems.__parent[proxyItems.__dataIndex] = tmpMap;
        }
      }
    });
    // 根对象就是 Map 时，直接将 final 指向可能做好的新 Map
    if (rootMeta.parentType === 'Map') {
      return mayRootMap || final;
    }
    return final
  },

  handleSet(rootMeta: DraftMeta, metaVer: number, final: any) {
    // @ts-ignore
    const setProxyItemsList = rootMeta.proxyItemsMgr['Set'];
    let mayRootSetArr: Array<any> | null = null;
    setProxyItemsList.forEach(proxyItems => {
      // @ts-ignore, 在 reassignGrandpaAndParent 做了标记
      if (proxyItems[isModifiedKey]) {
        const arr = Array.from(proxyItems);
        mayRootSetArr = arr;
        arr.forEach((val, idx) => {
          const meta = getMeta(val, metaVer);
          if (meta) {
            arr[idx] = !meta.modified ? meta.self : meta.copy;
          }
        });
        // @ts-ignore，指回来
        if (proxyItems.__parent) {
          // @ts-ignore
          proxyItems.__parent[proxyItems.__dataIndex] = new Set(arr);
        }
      }
    });
    // 根对象就是 Set 时，直接将 final 指向可能做好的新 Set
    if (rootMeta.parentType === 'Set') {
      return mayRootSetArr ? new Set(mayRootSetArr) : final;
    }
    return final;
  },

  handleArray(rootMeta: DraftMeta, metaVer: number, final: any) {
    // @ts-ignore
    const arrProxyItemsList = rootMeta.proxyItemsMgr['Array'];
    let mayRootArr: Array<any> = [];
    arrProxyItemsList.forEach(proxyItems => {
      // @ts-ignore, 在 reassignGrandpaAndParent 做了标记
      if (proxyItems[isModifiedKey]) {
        const proxyItemsMeta = getMeta(proxyItems, metaVer);
        const items = proxyItemsMeta?.copy || proxyItems;
        items.forEach((val, idx) => {
          const meta = getMeta(val, metaVer);
          if (meta) {
            mayRootArr[idx] = !meta.modified ? meta.self : meta.copy;
          } else {
            mayRootArr[idx] = val;
          }
        });

        // @ts-ignore
        const itemsParent = items.__parent;
        if (itemsParent) {
          // @ts-ignore 将去 proxy 后的结果指回去
          itemsParent[items.__dataIndex] = mayRootArr;
        }
      }
    });
    // 根对象就是 Array 时，直接将 final 指向可能做好的新 Array
    if (rootMeta.parentType === 'Array' && mayRootArr.length) {
      return mayRootArr;
    }
    return final;
  },

  /** reuse fronzen ata */
  getUnfrozenData(key) {
    return unforzenDataMap.get(key);
  },

  setUnfrozenData(key, data) {
    unforzenDataMap.set(key, data);
  }
};

export function buildLimuApis() {

  const limuApis = (() => {
    const metaVer = getMetaVer();
    let called = false;
    let revoke: null | (() => void) = null;

    const copyOnWriteTraps = {
      // parent指向的是代理之前的对象
      get: (parent, key) => {
        if (key === verKey) {
          return metaVer;
        }

        let currentChildVal = parent[key];
        if (key === '__proto__' || key === finishHandler || key === isModifiedKey) {
          return currentChildVal;
        }

        if (isSymbol(key)) {
          // 防止直接对 draft 时报错：Method xx.yy called on incompatible receiver
          // 例如 Array.from(draft)
          if (isFn(currentChildVal)) {
            return currentChildVal.bind(parent);
          }
          return currentChildVal;
        }

        const parentType = getDataNodeType(parent);
        const parentMeta = getMeta(parent, metaVer);

        // unfrozen this part data
        if (limuConfig.autoFreeze && isFrozenObj(currentChildVal)) {
          currentChildVal = makeCopy({ self: currentChildVal });
          parent[key] = currentChildVal;
          if (parentMeta && parentMeta.copy) {
            parentMeta.copy[key] = currentChildVal;
          }
        }

        // console.log(`Get parentType:${parentType} key:${key} `, 'Read KeyPath', getKeyPath(parent, key, metaVer));

        // copyWithin、sort 、valueOf... will hit the keys of 'asymmetricMatch', 'nodeType',
        // PROPERTIES_BLACK_LIST 里 'length', 'constructor', 'asymmetricMatch', 'nodeType'
        // 是为了配合 data-node-processor 里的 ATTENTION_1
        if (parentMeta && TYPE_BLACK_LIST.includes(parentType) && PROPERTIES_BLACK_LIST.includes(key)) {
          return parentMeta.copy ? parentMeta.copy[key] : parentMeta.self[key];
        }

        // 第 2+ 次进入 key 的 get 函数，已为 parent 生成了代理
        if (parentMeta) {
          const { self, copy } = parentMeta;
          const originalChildVal = self[key];

          if (!NO_CARE_COPY_TYPE_LIST.includes(parentType)) {
            // 存在 copy，则从 copy 上获取
            if (copy) {
              currentChildVal = copy[key];
            }

            // 产生了节点替换情况（此时currentChildVal应该是从 copy 里 获取的）
            // 直接返回 currentChildVal 即可
            // 因为 currentChildVal 已经是一个全新的值，无需对它做代理
            // ori: { a: 1 },     cur: 1 
            // ori: 1,            cur: { a: 1 } 
            // ori: 1,            cur: 2 
            // ori: { a: 1 }      cur: { a: 1 } 
            if (originalChildVal !== currentChildVal
              && Array.isArray(originalChildVal)
              && Array.isArray(currentChildVal)
              && parentMeta
              && !currentChildVal[metasKey]
            ) {
              // 返回出去的值因未做代理，之后对它的取值行为不会再进入到 get 函数中
              // todo：后续版本考虑 createDraft 加参数来控制是否为这种已替换节点也做代理
              const childMeta = getMeta(parent[key], metaVer);
              if (childMeta) {
                ensureDataNodeMetasProtoLayerFast(currentChildVal, metaVer);
                setMeta(currentChildVal, childMeta, metaVer);
                return childMeta.proxyVal;
              }
            }
          }
        }

        const createProxyVal = (currentChildVal, copy, parentDataIdx = -1) => {
          if (currentChildVal && !isPrimitive(currentChildVal)) {
            let meta = getMeta(currentChildVal, metaVer);

            if (!isFn(currentChildVal)) {
              ensureDataNodeMetasProtoLayer(currentChildVal, metaVer);

              // 惰性生成代理对象和其元数据
              if (!meta) {
                meta = {
                  rootMeta: null,
                  parentMeta: null,
                  parent,
                  parentType,
                  selfType: getDataNodeType(currentChildVal),
                  self: currentChildVal,
                  key,
                  idx: parentDataIdx,
                  keyPath: getKeyPath(parent, parentDataIdx, metaVer),
                  level: getNextMetaLevel(parent, metaVer),
                  proxyVal: new Proxy(currentChildVal, copyOnWriteTraps),
                  copy,
                  modified: false,
                  proxyItems: null,
                  proxyItemsMgr: null,
                  finishDraft: noop,
                  ver: metaVer,
                };

                const parentMeta = getMeta(parent, metaVer);
                if (parentMeta) {
                  meta.parentMeta = parentMeta;
                  meta.rootMeta = parentMeta.rootMeta;
                }
                setMeta(currentChildVal, meta, metaVer);
              }

              return meta.proxyVal;
            } else {
              if (shouldGenerateProxyItems(parentType, key)) {
                meta = getMeta(parent, metaVer);
                if (!meta) {
                  throw new Error('[[ createMeta ]]: oops, meta should not be null');
                }

                if (!meta.proxyItems) {
                  // 提前完成遍历，为所有 item 生成代理
                  let proxyItems: any = [];
                  if (parentType === carefulDataTypes.Set) {
                    const tmp = new Set();
                    (parent as Set<any>).forEach((val) => tmp.add(createProxyVal(val, tryMakeCopy(val))));
                    replaceSetOrMapMethods('Set', tmp, meta, parent, metaVer);
                    proxyItems = tmp;
                  } else if (parentType === carefulDataTypes.Map) {
                    const tmp = new Map();
                    (parent as Map<any, any>).forEach((val, key) => tmp.set(key, createProxyVal(val, tryMakeCopy(val), key)));
                    replaceSetOrMapMethods('Map', tmp, meta, parent, metaVer);
                    proxyItems = tmp;
                  } else if (parentType === carefulDataTypes.Array) {
                    const tmp: any[] = [];
                    const forEachTarget: any[] = meta.copy || parent;
                    meta.copy = tmp;
                    forEachTarget.forEach((val, idx) => tmp.push(createProxyVal(val, tryMakeCopy(val), idx)));
                    proxyItems = meta.proxyVal;
                  }

                  meta.proxyItems = proxyItems;
                  const targetMgr = meta.rootMeta?.proxyItemsMgr?.[parentType];
                  if (targetMgr) {
                    targetMgr.push(proxyItems);
                  }
                }
              }

              return currentChildVal;
            }
          }

          return currentChildVal;
        };

        // 可能会指向代理对象
        currentChildVal = createProxyVal(currentChildVal, null, key);

        let toReturn;
        // 用下标取数组时，可直接返回
        // 例如数组操作: arrDraft[0].xxx = 'new'， 此时 arrDraft[0] 需要操作的是代理对象
        if (parentType === carefulDataTypes.Array && canBeNum(key)) {
          toReturn = currentChildVal;
        } else if (carefulDataTypes[parentType]) {
          toReturn = copyAndGetDataNode(
            parent,
            { parentType, op: key, key, value: currentChildVal, metaVer, calledBy: 'get' },
            true,
          );
        } else {
          toReturn = currentChildVal;
        }

        return toReturn;
      },
      // parent 指向的是代理之前的对象
      set: (parent, key, value) => {
        // console.log('Set ', parent, key, value, 'Set KeyPath', getKeyPath(parent, key, metaVer));
        if (key === isModifiedKey) {
          parent.__proto__[isModifiedKey] = value;
          return true;
        }

        // speed up array operation
        const meta = getMeta(parent, metaVer);
        if (meta) {
          // @ts-ignore
          if (meta.copy && meta.__callSet && meta.selfType === carefulDataTypes.Array && canBeNum(key)) {
            meta.copy[key] = value;
            return true;
          }
          // @ts-ignore
          meta.__callSet = true;
        }

        copyAndGetDataNode(parent, { key, value, metaVer, calledBy: 'set' }, true);
        return true;
      },
      deleteProperty: (parent, key) => {
        // console.log('Delete ', parent, key);
        copyAndGetDataNode(parent, { op: 'del', key, value: '', metaVer, calledBy: 'deleteProperty' }, true);
        return true;
      },

      // trap function call
      apply: function (target, thisArg, argumentsList) {
        // console.log(`Apply `, target, thisArg, argumentsList);
        // expected output: "Calculate sum: 1,2"

        // return target(argumentsList[0], argumentsList[1]) * 10;
        return target.apply(thisArg, argumentsList);
      },
    };

    return {
      createDraft: <T extends ObjectLike>(mayDraft: T): T => {
        if (called) {
          throw new Error('can not call new Limu().createDraft twice');
        }
        let baseState = mayDraft;
        let originalBase = mayDraft;
        called = true;

        if (isDraft(mayDraft)) {
          const draftMeta = getMetaForDraft(mayDraft, mayDraft[verKey]);
          // @ts-ignore
          baseState = draftMeta.self;
          // @ts-ignore
          originalBase = draftMeta.self;
        }

        // in case of baseState is already a frozen data
        if (limuConfig.autoFreeze && !isFrozenObj(baseState)) {
          deepFreeze(baseState);
        }

        if (isFrozenObj(baseState)) {
          // baseState = makeCopy({ self: baseState });

          //speed up benchmark/readme-demo.js 4x
          baseState = inner.getUnfrozenData(originalBase) || makeCopy({ self: baseState });
          inner.setUnfrozenData(originalBase, baseState);
        }

        ensureDataNodeMetasProtoLayer(baseState, metaVer, true);
        let meta = getMeta(baseState, metaVer);
        if (!meta) {
          const baseStateType = getDataNodeType(baseState);
          meta = {
            rootMeta: null,
            parent: null,
            parentMeta: null,
            parentType: baseStateType,
            selfType: baseStateType,
            self: baseState,
            originalSelf: originalBase,
            copy: null,
            modified: false,
            key: '',
            keyPath: [],
            idx: -1,
            level: 0,
            proxyVal: null,
            proxyItems: null,
            proxyItemsMgr: {
              Map: [],
              Set: [],
              Array: [],
            },
            finishDraft: limuApis.finishDraft,
            ver: metaVer,
          };
          meta.rootMeta = meta;
          setMeta(baseState, meta, metaVer);
        }
        const { proxy: proxyDraft, revoke: revokeHandler } = Proxy.revocable(baseState, copyOnWriteTraps);

        meta.proxyVal = proxyDraft;
        revoke = revokeHandler;
        return proxyDraft;
      },
      // finishDraft: (proxyDraft, options = {}) => { // in v2.0, support options
      finishDraft: (proxyDraft) => {
        // attention: if pass a revoked proxyDraft
        // it will throw: Cannot perform 'set' on a proxy that has been revoked

        // 再次检查，以免用户是用 new Limu() 返回的 finishDraft 
        // 去结束另一个 new Limu() createDraft 的 草稿对象
        if (metaVer !== proxyDraft[verKey]) {
          throw new Error('oops, the input draft does not match finishDraft handler');
        }

        const rootMeta = getMetaForDraft(proxyDraft, metaVer);
        if (!rootMeta) {
          throw new Error('oops, rootMeta should not be null!');
        }

        let final = rootMeta.originalSelf || rootMeta.self;
        // 有 copy 不一定有修改行为，这里需做双重判断
        if (rootMeta.copy && rootMeta.modified) {
          final = rootMeta.copy;
          final = inner.handleMap(rootMeta, metaVer, final);
          final = inner.handleSet(rootMeta, metaVer, final);
          final = inner.handleArray(rootMeta, metaVer, final);
        }

        revoke && revoke();
        clearAllDataNodeMeta(metaVer);

        return final;
      },
    };
  })();

  return limuApis;
}
