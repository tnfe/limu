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
  replaceSetOrMapMethods,
} from './helper';
import { finishHandler, verKey } from '../support/symbols';
import { carefulDataTypes } from '../support/consts';
import { isPrimitive, canBeNum, isFn, noop, isSymbol } from '../support/util';
import { copyAndGetDataNode, clearAllDataNodeMeta, ensureDataNodeMetasProtoLayer } from './data-node-processor';
import { ObjectLike } from '../inner-types';


// size 直接返回，
// 避免 Cannot set property size of #<Map> which has only a getter
// 避免 Cannot set property size of #<Set> which has only a getter
const PROPERTIES_BLACK_LIST = ['length', 'constructor', 'asymmetricMatch', 'nodeType', 'size'];
// const FN_BLACK_LIST = ['sort'];
const TYPE_BLACK_LIST = [carefulDataTypes.Array, carefulDataTypes.Set, carefulDataTypes.Map];
// 这些类型不关心 copy
const NO_CARE_COPY_TYPE_LIST = [carefulDataTypes.Set, carefulDataTypes.Map, 'Object'];

export function buildLimuApis() {

  const limuApis = (() => {
    const metaVer = getMetaVer();
    let called = false;
    let revoke: null | (() => void) = null;

    var copyOnWriteTraps = {
      // parent指向的是代理之前的对象
      get: (parent, key) => {
        if (key === verKey) {
          return metaVer;
        }

        let currentChildVal = parent[key];
        if (key === '__proto__' || key === finishHandler) {
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
        // console.log(`Get parentType:${parentType} key:${key} `, 'Read KeyPath', getKeyPath(parent, key, metaVer));

        // copyWithin、sort 、valueOf... will hit the keys of 'asymmetricMatch', 'nodeType',
        // PROPERTIES_BLACK_LIST 里 'length', 'constructor', 'asymmetricMatch', 'nodeType'
        // 是为了配合 data-node-processor 里的 ATTENTION_1
        if (parentMeta && TYPE_BLACK_LIST.includes(parentType) && PROPERTIES_BLACK_LIST.includes(key)) {
          return parentMeta.copy ? parentMeta.copy[key] : parentMeta.self[key];
        }

        // 第 2+ 次进入 key 的 get 函数，已为 parent 生成了代理
        if (parentMeta && !NO_CARE_COPY_TYPE_LIST.includes(parentType)) {
          // if (parentMeta) {
          const { self, copy } = parentMeta;
          const originalChildVal = self[key];
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
          if (originalChildVal !== currentChildVal) {
            // console.log(` parentType${parentType} originalChildVal:${originalChildVal} currentChildVal:${currentChildVal}`);
            // 返回出去的值因未做代理，之后对它的取值行为不会再进入到 get 函数中
            // todo：后续版本考虑 createDraft 加参数来控制是否为这种已替换节点也做代理
            return currentChildVal;
          }
        }

        const createMeta = (currentChildVal, copy, parentDataIdx = -1) => {
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

              // console.log('===> get keyPath(1) ', meta.keyPath, ' key is', key, ' val ', currentChildVal);
              return meta.proxyVal;
            } else {
              if (shouldGenerateProxyItems(parentType, key)) {
                meta = getMeta(parent, metaVer);
                if (!meta) {
                  throw new Error('[[ createMeta ]]: oops, meta should not be null');
                }

                // console.log('===> get keyPath(2) ', meta.keyPath, ' key is', key);
                if (!meta.proxyItems) {
                  // 提前完成遍历，为所有 item 生成代理
                  let proxyItems: any = [];
                  if (parentType === carefulDataTypes.Set) {
                    const tmp = new Set();
                    (parent as Set<any>).forEach((val) => tmp.add(createMeta(val, tryMakeCopy(val))));
                    replaceSetOrMapMethods('Set', tmp, meta, parent, metaVer);
                    proxyItems = tmp;
                  } else if (parentType === carefulDataTypes.Map) {
                    const tmp = new Map();
                    (parent as Map<any, any>).forEach((val, key) => tmp.set(key, createMeta(val, tryMakeCopy(val), key)));
                    replaceSetOrMapMethods('Map', tmp, meta, parent, metaVer);
                    proxyItems = tmp;
                  } else if (parentType === carefulDataTypes.Array) {
                    const tmp: any[] = [];
                    (parent as any[]).forEach((val, idx) => tmp.push(createMeta(val, tryMakeCopy(val), idx)));
                    proxyItems = tmp;
                  }

                  meta.proxyItems = proxyItems;
                  const targetMgr = meta.rootMeta?.proxyItemsMgr?.[parentType];
                  if (targetMgr) {
                    targetMgr.push(proxyItems);
                  }
                }
              } else {
                if (parentType === carefulDataTypes.Map, key === 'get') {
                  // createMeta(parent.get(), tryMakeCopy(val), key)
                }
                // console.log('===> get keyPath(3) ', getMeta(currentChildVal, metaVer)?.keyPath, ' key is', key);
              }

              return currentChildVal;
            }
          }

          // console.log('===> get keyPath(4) ', getMeta(currentChildVal, metaVer)?.keyPath || [parentDataIdx], ' key is', key);
          return currentChildVal;
        };

        // 可能会指向代理对象
        currentChildVal = createMeta(currentChildVal, null, key);
        // currentChildVal = createMeta(currentChildVal, tryMakeCopy(currentChildVal), key);
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
        // console.log('Set ', parent, key, value);
        copyAndGetDataNode(parent, { key, value, metaVer, calledBy: 'set' }, true);
        const meta = getMeta(parent, metaVer);
        if (meta) {
          // console.log('set meta.keyPath ', [...meta.keyPath, key], ' key is', key, ' value is', value);
        }
        return true;
      },
      deleteProperty: (parent, key) => {
        // console.log('Delete ', parent, key);
        copyAndGetDataNode(parent, { op: 'del', key, value: '', metaVer, calledBy: 'deleteProperty' }, true);
        return true;
      },

      // trap function call
      apply: function (target, thisArg, argumentsList) {
        console.log(`Apply `, target, thisArg, argumentsList);
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
        called = true;

        if (isDraft(mayDraft)) {
          const draftMeta = getMetaForDraft(mayDraft, mayDraft[verKey]);
          // @ts-ignore
          baseState = draftMeta.self;
        }

        ensureDataNodeMetasProtoLayer(baseState, metaVer, true);
        let meta = getMeta(baseState, metaVer);
        if (!meta) {
          meta = {
            rootMeta: null,
            parent: null,
            parentMeta: null,
            parentType: getDataNodeType(baseState),
            self: baseState,
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
      // finishDraft: (proxyDraft, options = {}) => {
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

        let final = rootMeta.self;
        // 有 copy 不一定有修改行为，这里需做双重判断
        if (rootMeta.copy && rootMeta.modified) {
          final = rootMeta.copy;
          // @ts-ignore
          const mapProxyItemsList = rootMeta.proxyItemsMgr['Map'];
          let mayRootMap: Map<any, any> | null = null;
          // 用于辅助跑通  /test/map-other/object-map.ts
          mapProxyItemsList.forEach(proxyItems => {
            // @ts-ignore, 在 reassignGrandpaAndParent 做了标记
            if (proxyItems.__modified) {
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
            final = mayRootMap || final;
          }

          // @ts-ignore
          const setProxyItemsList = rootMeta.proxyItemsMgr['Set'];
          let mayRootSetArr: Array<any> | null = null;
          setProxyItemsList.forEach(proxyItems => {
            // @ts-ignore, 在 reassignGrandpaAndParent 做了标记
            if (proxyItems.__modified) {
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
            final = mayRootSetArr ? new Set(mayRootSetArr) : final;
          }

          // @ts-ignore
          const arrProxyItemsList = rootMeta.proxyItemsMgr['Array'];
          arrProxyItemsList.forEach(proxyItems => {
            // @ts-ignore, 在 reassignGrandpaAndParent 做了标记
            if (proxyItems.__modified) {
              proxyItems.forEach((val, idx) => {
                const meta = getMeta(val, metaVer);
                if (meta && !meta.modified) {
                  proxyItems[idx] = meta.self;
                }
              });
            }
          });
        }

        // todo: 留着这个参数，解决多引用问题
        // var base = { a: { b: { c: 1 } }, b: null };
        // base.b = base.a.b;
        // var im = new Limu();
        // var d = im.createDraft(base);
        // d.b.c = 888;
        // if (options.multiRef && rootMeta.copy) {
        // }

        revoke && revoke();
        clearAllDataNodeMeta(metaVer);
        return final;
      },
    };
  })();

  return limuApis;
}


/** 规划中的接口
 interface TrapInfo{
   method: 'get' | 'set' | 'delete'
   key: 'string',
   value: any,
   path: (string | number)[],

 }

 trapListener: (trapInfo:TrapInfo)=>void;
 */