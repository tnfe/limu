/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Tencent Corporation. All rights reserved.
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { ObjectLike, DraftMeta, ICreateDraftOptions } from '../inner-types';
import {
  shouldGenerateProxyItems,
  replaceSetOrMapMethods,
  deepFreeze,
  getUnProxyValue,
  createScopedMeta,
} from './helper';
import { finishHandler, verKey, META_KEY } from '../support/symbols';
import { carefulDataTypes, MAP, SET, ARRAY } from '../support/consts';
import { limuConfig } from '../support/inner-data';
import { isPrimitive, canBeNum, isFn, isSymbol } from '../support/util';
import { handleDataNode } from './data-node-processor';
import { genMetaVer, getDraftMeta, isDraft, attachMeta } from './meta';
import { extraFinalData, isInSameScope, recordVerScope } from './scope';

// size 直接返回，
// 避免 Cannot set property size of #<Map> which has only a getter
// 避免 Cannot set property size of #<Set> which has only a getter
const PROPERTIES_BLACK_LIST = ['length', 'constructor', 'asymmetricMatch', 'nodeType', 'size'];
const TYPE_BLACK_LIST = [ARRAY, SET, MAP];


export function buildLimuApis() {

  const limuApis = (() => {
    const metaVer = genMetaVer();
    let called = false;
    // let revoke: null | (() => void) = null;
    // 调用那一刻起，确定 autoFreeze 值
    let autoFreeze = limuConfig.autoFreeze;
    /**
     * 为了和下面这个 immer case 保持行为一致
     * https://github.com/immerjs/immer/issues/960
     * 如果数据节点上人工赋值了其他 draft 的话，当前 draft 结束后不能够被冻结（ 见set逻辑 ）
     */
    let canFreezeDraft = true;
    // 暂未实现
    let usePatches = limuConfig.usePatches;
    const patches: any[] = [];
    const inversePatches: any[] = [];

    // >= 3.0+ ver, copy on read, mark modified on write
    const limuTraps = {
      // parent指向的是代理之前的对象
      get: (parent, key) => {
        if (key === verKey) {
          return metaVer;
        }

        let currentChildVal = parent[key];
        if (key === '__proto__' || key === finishHandler || key === META_KEY) {
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

        const parentMeta = getDraftMeta(parent) as DraftMeta;
        const parentType = parentMeta?.selfType as any;

        // console.log(`Get parentType:${parentType} key:${key} `, 'Read KeyPath', getKeyPath(parent, key, metaVer));

        // copyWithin、sort 、valueOf... will hit the keys of 'asymmetricMatch', 'nodeType',
        // PROPERTIES_BLACK_LIST 里 'length', 'constructor', 'asymmetricMatch', 'nodeType'
        // 是为了配合 data-node-processor 里的 ATTENTION_1
        if (parentMeta && TYPE_BLACK_LIST.includes(parentType) && PROPERTIES_BLACK_LIST.includes(key)) {
          return parentMeta.copy[key];
        }

        const createProxyVal = (selfVal, options?: any) => {
          if (isPrimitive(selfVal)) {
            return selfVal;
          }

          if (selfVal) {
            const { key = '' } = options || {};
            let valMeta = getDraftMeta(selfVal);

            if (!isFn(selfVal)) {
              // 惰性生成代理对象和其元数据
              if (!valMeta) {
                valMeta = createScopedMeta(selfVal, { key, parentMeta, ver: metaVer, traps: limuTraps });
                recordVerScope(valMeta);
                // child value 指向 copy
                parent[key] = valMeta.copy;
              }
              return valMeta.proxyVal;
            } else {
              if (shouldGenerateProxyItems(parentType, key)) {
                valMeta = getDraftMeta(parent) as DraftMeta;
                if (!valMeta) {
                  throw new Error('[[ createMeta ]]: oops, meta should not be null');
                }

                if (!valMeta.proxyItems) {
                  // 提前完成遍历，为所有 item 生成代理
                  let proxyItems: any = [];
                  if (parentType === SET) {
                    const tmp = new Set();
                    (parent as Set<any>).forEach((val) => tmp.add(createProxyVal(val)));
                    replaceSetOrMapMethods(tmp, valMeta, { dataType: SET, patches, inversePatches, usePatches });
                    proxyItems = attachMeta(tmp, valMeta);

                    // 区别于 2.0.2 版本，这里提前把copy指回来
                    parentMeta.copy = proxyItems;
                  } else if (parentType === MAP) {
                    const tmp = new Map();
                    (parent as Map<any, any>).forEach((val, key) => tmp.set(key, createProxyVal(val, { key })));
                    replaceSetOrMapMethods(tmp, valMeta, { dataType: MAP, patches, inversePatches, usePatches });
                    proxyItems = attachMeta(tmp, valMeta);

                    // 区别于 2.0.2 版本，这里提前把copy指回来
                    parentMeta.copy = proxyItems;
                  } else if (parentType === carefulDataTypes.Array) {
                    valMeta.copy = valMeta.copy || parent.slice();
                    proxyItems = valMeta.proxyVal;
                  }

                  valMeta.proxyItems = proxyItems;
                }
              }

              return selfVal;
            }
          }

          return selfVal;
        };

        // 可能会指向代理对象
        currentChildVal = createProxyVal(currentChildVal, { key });

        let toReturn;
        // 用下标取数组时，可直接返回
        // 例如数组操作: arrDraft[0].xxx = 'new'， 此时 arrDraft[0] 需要操作的是代理对象
        if (parentType === carefulDataTypes.Array && canBeNum(key)) {
          toReturn = currentChildVal;
        } else if (carefulDataTypes[parentType]) {
          toReturn = handleDataNode(
            parent,
            {
              op: key, key, value: currentChildVal, metaVer, calledBy: 'get',
              patches, inversePatches, usePatches, parentType,
            },
          );
        } else {
          toReturn = currentChildVal;
        }

        return toReturn;
      },
      // parent 指向的是代理之前的对象
      set: (parent, key, value) => {
        // console.log('Set', parent, key, value, 'Set KeyPath', getKeyPath(parent, key, metaVer));
        let targetValue = value;

        if (isDraft(value)) {
          // see case debug/complex/set-draft-node
          if (isInSameScope(value, metaVer)) {
            targetValue = getUnProxyValue(value);
            if (targetValue === parent[key]) {
              return true;
            }
          } else {
            // assign another version V2 scope draft node value to current scope V1 draft node
            canFreezeDraft = false;
          }
        }

        if (key === META_KEY) {
          parent[key] = targetValue;
          return true;
        }


        // speed up array operation
        const meta = getDraftMeta(parent);
        // recordPatch({ meta, patches, inversePatches, usePatches, op: key, value });
        const isArray = meta.selfType === ARRAY;
        if (meta && isArray) {
          // @ts-ignore
          if (meta.copy && meta.__callSet && isArray && canBeNum(key)) {
            meta.copy[key] = targetValue;
            return true;
          }
          // @ts-ignore
          meta.__callSet = true;
        }
        handleDataNode(parent, { key, value: targetValue, metaVer, calledBy: 'set' });
        return true;
      },
      deleteProperty: (parent, key) => {
        // console.log('Delete ', parent, key);
        handleDataNode(parent, { op: 'del', key, value: '', metaVer, calledBy: 'deleteProperty' });
        return true;
      },

      // trap function call
      apply: function (target, thisArg, args) {
        return target.apply(thisArg, args);
      },
    };

    return {
      createDraft: <T extends ObjectLike>(mayDraft: T, options?: ICreateDraftOptions): T => {
        // allow user overwrite autoFreeze setting in current call process
        const opts = options || {};
        autoFreeze = opts.autoFreeze ?? autoFreeze;
        usePatches = opts.usePatches ?? usePatches;

        if (called) {
          throw new Error('can not call new Limu().createDraft twice');
        }
        let baseOri = mayDraft;
        called = true;

        if (isDraft(mayDraft)) {
          const draftMeta = getDraftMeta(mayDraft);
          baseOri = draftMeta.self;
        }

        const meta = createScopedMeta(baseOri, { key: '', ver: metaVer, traps: limuTraps, finishDraft: limuApis.finishDraft });
        recordVerScope(meta);

        return meta.proxyVal as T;
      },
      finishDraft: (proxyDraft) => {
        // attention: if pass a revoked proxyDraft
        // it will throw: Cannot perform 'set' on a proxy that has been revoked
        const rootMeta = getDraftMeta(proxyDraft);
        if (!rootMeta) {
          throw new Error('oops, rootMeta should not be null!');
        }
        if (rootMeta.level !== 0) {
          throw new Error('oops, can not finish sub draft node!');
        }
        // 再次检查，以免用户是用 new Limu() 返回的 finishDraft
        // 去结束另一个 new Limu() createDraft 的 草稿对象
        if (metaVer !== rootMeta.ver) {
          throw new Error('oops, the input draft does not match finishDraft handler');
        }

        let final = extraFinalData(rootMeta);
        if (autoFreeze && canFreezeDraft) {
          // TODO deep pruning
          // see https://github.com/immerjs/immer/issues/687
          // let cachedFrozenOriginalBase = frozenOriginalBaseMap.get(rootMeta.originalSelf);
          final = deepFreeze(final);
        }

        // if (usePatches) {
        //   return [final, patches, inversePatches];
        // }
        return final;
      },
    };
  })();

  return limuApis;
}
