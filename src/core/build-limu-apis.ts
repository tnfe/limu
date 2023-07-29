/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { DraftMeta, IInnerCreateDraftOptions, ObjectLike, Op } from '../inner-types';
import { ARRAY, CAREFUL_FNKEYS, CHANGE_FNKEYS, CAREFUL_TYPES, IMMUT_BASE, MAP, META_KEY, SET } from '../support/consts';
import { conf } from '../support/inner-data';
import { canBeNum, isFn, isPrimitive, isSymbol } from '../support/util';
import { handleDataNode } from './data-node-processor';
import { deepFreeze } from './freeze';
import { createScopedMeta, getProxyVal, getUnProxyValue } from './helper';
import { genMetaVer, getDraftMeta, isDraft } from './meta';
import { extraFinalData, isInSameScope, recordVerScope } from './scope';

// 可直接返回的属性
// 避免 Cannot set property size of #<Map> which has only a getter
// 避免 Cannot set property size of #<Set> which has only a getter
const PROPERTIES_BLACK_LIST = ['length', 'constructor', 'asymmetricMatch', 'nodeType', 'size'];
const TYPE_BLACK_LIST = [ARRAY, SET, MAP];

export function buildLimuApis(options?: IInnerCreateDraftOptions) {
  const opts = options || {};
  const onOperate = opts.onOperate;
  const fastModeRange = opts.fastModeRange || conf.fastModeRange;
  // @ts-ignore
  const immutBase = opts[IMMUT_BASE] ?? false;
  const extraProps = opts.extraProps || null;
  const readOnly = opts.readOnly ?? false;
  // 调用那一刻起，确定 autoFreeze 值
  // allow user overwrite autoFreeze setting in current call process
  const autoFreeze = opts.autoFreeze ?? conf.autoFreeze;
  // 暂未实现 to be implemented in the future
  const usePatches = opts.usePatches ?? conf.usePatches;

  const execOnOperate = (op: Op, key: string, parentMeta: DraftMeta) => {
    if (!parentMeta || !onOperate) return;
    const { selfType, keyPath, self, copy } = parentMeta;
    const fnKeys = CAREFUL_FNKEYS[selfType] || [];
    let isChange = op !== 'get';
    let isBuiltInFnKey = false;
    if (fnKeys.includes(key)) {
      isBuiltInFnKey = true;
      const changeFnKeys = CHANGE_FNKEYS[selfType] || [];
      isChange = changeFnKeys.includes(key);
    }

    onOperate({
      parentType: selfType,
      op,
      isBuiltInFnKey,
      isChange,
      key,
      keyPath,
      fullKeyPath: keyPath.concat(key),
      value: copy[key] || self[key],
    });
  };

  const limuApis = (() => {
    const metaVer = genMetaVer();
    // let revoke: null | (() => void) = null;
    /**
     * 为了和下面这个 immer case 保持行为一致
     * https://github.com/immerjs/immer/issues/960
     * 如果数据节点上人工赋值了其他 draft 的话，当前 draft 结束后不能够被冻结（ 见set逻辑 ）
     */
    let canFreezeDraft = true;
    const patches: any[] = [];
    const inversePatches: any[] = [];

    // >= 3.0+ ver, shadow copy on read, mark modified on write
    const limuTraps = {
      // parent指向的是代理之前的对象
      get: (parent: any, key: any) => {
        let currentChildVal = parent[key];

        if (key === 'toJSON' && Array.isArray(parent)) {
          return currentChildVal;
        }

        if (key === '__proto__' || key === META_KEY) {
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
        const parentType = parentMeta?.selfType;
        // copyWithin、sort 、valueOf... will hit the keys of 'asymmetricMatch', 'nodeType',
        // PROPERTIES_BLACK_LIST 里 'length', 'constructor', 'asymmetricMatch', 'nodeType'
        // 是为了配合 data-node-processor 里的 ATTENTION_1
        if (TYPE_BLACK_LIST.includes(parentType) && PROPERTIES_BLACK_LIST.includes(key)) {
          return parentMeta.copy[key];
        }
        // 可能会指向代理对象
        currentChildVal = getProxyVal(currentChildVal, {
          key,
          parentMeta,
          parentType,
          ver: metaVer,
          traps: limuTraps,
          parent,
          patches,
          fastModeRange,
          immutBase,
          readOnly,
          inversePatches,
          usePatches, // not implement currently
        });

        // 用下标取数组时，可直接返回
        // 例如数组操作: arrDraft[0].xxx = 'new'， 此时 arrDraft[0] 需要操作的是代理对象
        if (parentType === ARRAY && canBeNum(key)) {
          execOnOperate('get', key, parentMeta);
          return currentChildVal;
        }

        // @ts-ignore
        if (CAREFUL_TYPES[parentType]) {
          currentChildVal = handleDataNode(parent, {
            op: key,
            key,
            value: currentChildVal,
            metaVer,
            calledBy: 'get',
            patches,
            inversePatches,
            usePatches,
            parentType,
            parentMeta,
          });
          execOnOperate('get', key, parentMeta);
          return currentChildVal;
        }

        execOnOperate('get', key, parentMeta);
        return currentChildVal;
      },
      // parent 指向的是代理之前的对象
      set: (parent: any, key: any, value: any) => {
        let targetValue = value;

        if (readOnly) {
          console.error('can not mutate state at readOnly mode!');
          return true;
        }

        if (isDraft(value)) {
          // see case debug/complex/set-draft-node
          if (isInSameScope(value, metaVer)) {
            targetValue = getUnProxyValue(value);
            if (targetValue === parent[key]) {
              return true;
            }
          } else {
            // TODO: judge value must be root draft node
            // assign another scope draft node to current scope
            canFreezeDraft = false;
          }
        }

        // speed up array operation
        const parentMeta = getDraftMeta(parent);
        // implement this in the future
        // recordPatch({ meta, patches, inversePatches, usePatches, op: key, value });
        if (parentMeta && parentMeta.selfType === ARRAY) {
          // @ts-ignore
          if (parentMeta.copy && parentMeta.__callSet && canBeNum(key)) {
            parentMeta.copy[key] = targetValue;
            execOnOperate('set', key, parentMeta);
            return true;
          }
          // @ts-ignore, mark is set called on parent node
          parentMeta.__callSet = true;
        }

        handleDataNode(parent, {
          parentMeta,
          key,
          value: targetValue,
          metaVer,
          calledBy: 'set',
        });
        execOnOperate('set', key, parentMeta);

        return true;
      },
      // delete or Reflect.deleteProperty will trigger this trap
      deleteProperty: (parent: any, key: any) => {
        const parentMeta = getDraftMeta(parent);
        handleDataNode(parent, {
          parentMeta,
          op: 'del',
          key,
          value: '',
          metaVer,
          calledBy: 'deleteProperty',
        });
        execOnOperate('del', key, parentMeta);

        return true;
      },
      // trap function call
      apply: function (target: any, thisArg: any, args: any[]) {
        return target.apply(thisArg, args);
      },
    };

    return {
      createDraft: <T extends ObjectLike>(mayDraft: T): T => {
        if (isPrimitive(mayDraft)) {
          throw new Error('base state can not be primitive');
        }
        let oriBase = mayDraft;

        const draftMeta = getDraftMeta(mayDraft);
        if (draftMeta) {
          // 总是返回同一个 immutBase 代理对象
          if (immutBase && draftMeta.isImmutBase) {
            return draftMeta.proxyVal as T;
          }
          oriBase = draftMeta.self;
        }

        const meta = createScopedMeta(oriBase, {
          key: '',
          ver: metaVer,
          traps: limuTraps,
          finishDraft: limuApis.finishDraft,
          immutBase,
          readOnly,
          extraProps,
        });
        recordVerScope(meta);

        return meta.proxyVal as T;
      },
      finishDraft: (proxyDraft: any) => {
        // attention: if pass a revoked proxyDraft
        // it will throw: Cannot perform 'set' on a proxy that has been revoked
        const rootMeta = getDraftMeta(proxyDraft);
        if (!rootMeta) {
          throw new Error('rootMeta should not be null!');
        }
        if (rootMeta.level !== 0) {
          throw new Error('can not finish sub draft node!');
        }
        // immutBase 是一个一直可用的对象
        // 对 immut() 返回的对象调用 finishDraft 则总是返回 immutBase 自身代理
        // 将 immut() 返回结果传给 finishDraft 是无意义的
        if (rootMeta.isImmutBase) {
          return proxyDraft;
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
