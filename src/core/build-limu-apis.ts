/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { DraftMeta, IApiCtx, IExecOnOptions, IInnerCreateDraftOptions, ObjectLike, Op } from '../inner-types';
import {
  ARRAY,
  CAREFUL_FNKEYS,
  CAREFUL_TYPES,
  CHANGE_FNKEYS,
  IMMUT_BASE,
  JS_SYM_KEYS,
  MAP,
  META_VER,
  OP_DEL,
  OP_GET,
  OP_SET,
  SET,
} from '../support/consts';
import { conf, genMetaVer } from '../support/inner-data';
import { canBeNum, has, isFn, isPrevVerDraft, isPrimitive, isSymbol } from '../support/util';
import { handleDataNode } from './data-node-processor';
import { deepFreeze } from './freeze';
import { createScopedMeta, getMayProxiedVal, getUnProxyValue } from './helper';
import { getSafeDraftMeta, getDraftMeta, isDraft, getPrivateMeta, replaceMetaPartial, ROOT_CTX } from './meta';
import { pushKeyPath, getValByKeyPaths, getVal, setValByKeyPaths, getKeyStrPath } from './path-util';
import { extractFinalData, isInSameScope, recordVerScope } from './scope';

// 可直接返回的属性
// 避免 Cannot set property size of #<Map> which has only a getter
// 避免 Cannot set property size of #<Set> which has only a getter
const PROPERTIES_BLACK_LIST = ['length', 'constructor', 'asymmetricMatch', 'nodeType', 'size'] as const;
const PBL_DICT: Record<string, number> = {}; // for perf
PROPERTIES_BLACK_LIST.forEach((item) => (PBL_DICT[item] = 1));
const noop = (arg: any) => arg;

const TYPE_BLACK_DICT: Record<string, number> = { [ARRAY]: 1, [SET]: 1, [MAP]: 1 }; // for perf
export const FINISH_HANDLER_MAP = new Map();

export function buildLimuApis(options?: IInnerCreateDraftOptions) {
  const opts = options || {};
  const onOperate = opts.onOperate;
  const hasOnOperate = !!onOperate;
  const customKeys = opts.customKeys || [];
  // @ts-ignore
  const immutBase = opts[IMMUT_BASE] ?? false;
  const readOnly = opts.readOnly ?? false;
  const disableWarn = opts.disableWarn;
  const compareVer = opts.compareVer ?? false;
  // 调用那一刻起，确定 autoFreeze 值
  // allow user overwrite autoFreeze setting in current call process
  const autoFreeze = opts.autoFreeze ?? conf.autoFreeze;
  // 暂未实现 to be implemented in the future
  const metaVer = genMetaVer();
  const apiCtx: IApiCtx = { metaMap: new Map(), newNodeMap: new Map(), metaVer };
  ROOT_CTX.set(metaVer, apiCtx);

  const autoRevoke = opts.autoRevoke ?? conf.autoRevoke;
  const silenceSetTrapErr = opts.silenceSetTrapErr ?? true;
  const logChangeFailed = (op: string, key: string) => {
    console.warn(`${op} failed, cuase draft root has been finised! key:`, key);
    return silenceSetTrapErr;
  };
  const logSetExpiredValFailed = (op: string, key: string) => {
    console.warn(`${op} failed, cuase the value is an expired limu proxy data! key:`, key);
    return silenceSetTrapErr;
  };

  let isDraftFinished = false;

  const warnReadOnly = () => {
    if (!disableWarn) {
      console.warn('can not mutate state at readOnly mode!');
    }
    return true;
  };

  const execOnOperate = (op: Op, key: any, options: IExecOnOptions) => {
    const { mayProxyVal, parentMeta: inputPMeta, value, isCustom = false } = options;
    let isChanged = false;
    const isNotGet = op !== OP_GET;
    // set del 时，replacedValue 初始值指向 value
    // get 时，replacedValue 初始值指向 mayProxyVal
    let replacedValue: any = isNotGet ? value : mayProxyVal;

    if (!onOperate) return { isChanged, replacedValue };
    const parentMeta = (inputPMeta || {}) as DraftMeta;
    const { selfType = '', keyPath = [], copy, self, modified, proxyVal: parentProxy } = parentMeta || {};

    let isBuiltInFnKey = false;
    // 优先采用显式传递的 isChange
    if (options.isChanged !== undefined) {
      isChanged = options.isChanged;
    } else {
      const fnKeys = CAREFUL_FNKEYS[selfType] || [];
      if (fnKeys.includes(key)) {
        isBuiltInFnKey = true;
        const changeFnKeys = CHANGE_FNKEYS[selfType] || [];
        isChanged = changeFnKeys.includes(key);
      } else if (isNotGet) {
        // 变化之后取 copy 比较
        const node = modified ? copy : self;
        isChanged = inputPMeta ? node[key] !== value : true;
      }
    }

    let isReplaced = false;
    const replaceValue = (newValue: any) => {
      isReplaced = true;
      replacedValue = newValue;
    };
    const getReplaced = () => ({ isReplaced, replacedValue });
    onOperate({
      immutBase,
      parent: self,
      parentType: selfType,
      parentProxy,
      op,
      replaceValue,
      getReplaced,
      isBuiltInFnKey,
      isChanged,
      isCustom,
      key,
      keyPath,
      fullKeyPath: keyPath.concat(key),
      value,
      // 写操作时，proxyValue 是 undefined
      proxyValue: mayProxyVal,
    });
    return {
      replacedValue,
      isChanged,
    };
  };

  const limuApis = (() => {
    // let revoke: null | (() => void) = null;
    /**
     * 为了和下面这个 immer case 保持行为一致
     * https://github.com/immerjs/immer/issues/960
     * 如果数据节点上人工赋值了其他 draft 的话，当前 draft 结束后不能够被冻结（ 见set逻辑 ）
     */
    let canFreezeDraft = true;

    // >= 3.0+ ver, shadow copy on read, mark modified on write
    const limuTraps = {
      // parent指向的是代理之前的对象
      get: (parent: any, key: any) => {
        if (META_VER === key) {
          return metaVer;
        }

        /** current child value, it may been replaced to a proxy value later */
        const currentVal = parent[key];
        if (JS_SYM_KEYS.includes(key)) {
          // 避免报错 Method xx.yy called on incompatible receiver
          // 例如 Array.from(draft)
          if (isFn(currentVal)) {
            // 执行 for(const item of list){ ... } 语句
            if (Symbol.iterator === key && Array.isArray(parent)) {
              let idx = 0;
              // 模拟迭代器
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol
              const iter = () => ({
                next: () => {
                  const len = parent.length;
                  if (len === 0) {
                    return { done: true, value: undefined };
                  }
                  // 前一次迭代已到达最后一个元素时，idx === len
                  const done = idx === len;
                  // key 格式统一为字符串，故这里包一层 String
                  const value = done ? undefined : limuTraps.get(parent, String(idx));
                  idx++;
                  return { done, value };
                },
                [Symbol.iterator]: () => {
                  return iter;
                },
              });
              return iter;
            }
            return currentVal.bind(parent);
          }
          return currentVal;
        }

        // 判断 toJSON 是为了兼容 JSON.stringify 调用, https://javascript.info/json#custom-tojson
        if (key === '__proto__' || (key === 'toJSON' && !has(parent, key))) {
          return currentVal;
        }
        let mayProxyVal = currentVal;
        const parentMeta = getSafeDraftMeta(parent, apiCtx);

        const valueMeta = getDraftMeta(mayProxyVal, apiCtx);
        noop(isSymbol);

        // if (valueMeta && valueMeta.parentMeta !== parentMeta && !isSymbol(key)) {
        if (valueMeta && valueMeta.parentMeta !== parentMeta) {
          const prevKeyPath = valueMeta.keyPath;
          const newKeyPath = parentMeta.keyPath.concat(key);
          const prevKeyStrPath = getKeyStrPath(prevKeyPath);
          const newKeyStrPath = getKeyStrPath(newKeyPath);

          if (prevKeyStrPath.join('|') !== newKeyStrPath.join('|')) {
            // 发现一条新的路径指向当前 value，说明存在多引用
            valueMeta.keyPaths.push(newKeyPath);
            valueMeta.keyStrPaths.push(newKeyStrPath);
            if (valueMeta.modified) {
              let curKey = key;
              let curMeta = valueMeta;
              let curPMeta = parentMeta;
              do {
                curPMeta.copy[curKey] = curMeta.copy;
                curPMeta.modified = true;

                curKey = curPMeta.key;
                curMeta = curPMeta;
                // @ts-ignore
                curPMeta = curPMeta.parentMeta;
              } while (curPMeta);
            }
            return valueMeta.proxyVal;
          }
        }

        if (customKeys.includes(key)) {
          const ret = execOnOperate(OP_GET, key, { parentMeta, mayProxyVal, value: currentVal, isChanged: false, isCustom: true });
          return ret.replacedValue;
        }

        const parentType = parentMeta?.selfType;
        // copyWithin、sort 、valueOf... will hit the keys of 'asymmetricMatch', 'nodeType',
        // PROPERTIES_BLACK_LIST 里 'length', 'constructor', 'asymmetricMatch', 'nodeType'
        if (TYPE_BLACK_DICT[parentType] && PBL_DICT[key]) {
          if (key === 'length' || key === 'size') {
            execOnOperate(OP_GET, key, { parentMeta, mayProxyVal, value: currentVal });
          }
          return parentMeta.copy[key];
        }
        // 可能会指向代理对象
        mayProxyVal = getMayProxiedVal(currentVal, {
          key,
          compareVer,
          parentMeta,
          parentType,
          ver: metaVer,
          traps: limuTraps,
          parent,
          immutBase,
          readOnly,
          apiCtx,
          hasOnOperate,
          autoRevoke,
        });

        // 用下标取数组时，可直接返回
        // 例如数组操作: arrDraft[0].xxx = 'new'， 此时 arrDraft[0] 需要操作的是代理对象
        if (parentType === ARRAY && canBeNum(key)) {
          const ret = execOnOperate(OP_GET, key, { parentMeta, mayProxyVal, value: currentVal });
          return ret.replacedValue;
        }

        // @ts-ignore
        if (CAREFUL_TYPES[parentType]) {
          mayProxyVal = handleDataNode(parent, {
            op: key,
            key,
            value: currentVal,
            metaVer,
            calledBy: OP_GET,
            parentType,
            parentMeta,
            apiCtx,
          });
          const ret = execOnOperate(OP_GET, key, { parentMeta, mayProxyVal, value: currentVal });
          return ret.replacedValue;
        }

        const ret = execOnOperate(OP_GET, key, { parentMeta, mayProxyVal, value: currentVal });
        return ret.replacedValue;
      },
      // parent 指向的是代理之前的对象
      set: (parent: any, key: any, inputValue: any) => {
        if (isDraftFinished) {
          return logChangeFailed(OP_SET, key);
        }
        let mayNewNode = true;

        const parentMeta = getSafeDraftMeta(parent, apiCtx);
        // fix issue https://github.com/tnfe/limu/issues/12
        let isValueDraft = false;
        let value = inputValue;

        // is a draft proxy node
        if (isDraft(inputValue)) {
          isValueDraft = true;
          // see case debug/complex/set-draft-node
          if (isInSameScope(inputValue, metaVer)) {

            const rawValue = getUnProxyValue(inputValue, apiCtx);
            // 相同路径赋相同的值，不做任何处理
            if (rawValue === parent[key]) {
              return true;
            }

            const valueMeta = getSafeDraftMeta(inputValue, apiCtx);
            const newKeyPath = parentMeta.keyPath.concat(key);
            pushKeyPath(valueMeta, newKeyPath);
          } else {
            // TODO: judge value must be a root draft node
            // assign another scope draft node to current scope
            canFreezeDraft = false;
          }
        } else if (isPrevVerDraft(inputValue, metaVer)) {
          const { proxyVal: rootProxy, self: rootSelf } = parentMeta.rootMeta;
          // 是一个之前版本的 limu 草稿对象，尝试根据之前的路径获取当前 scope 对应的代理对象来赋值
          const prevVerMeta = getPrivateMeta(inputValue);
          const { isGetted, val } = getValByKeyPaths(rootProxy, prevVerMeta.keyPaths);
          if (!isGetted) {
            return logSetExpiredValFailed(OP_SET, key);
          }
          const curVerMeta = getPrivateMeta(val);
          replaceMetaPartial(prevVerMeta, curVerMeta, key);

          const newKeyPath = parentMeta.keyPath.concat(key);
          // 所有路径上的值提替换掉
          curVerMeta.keyPaths.forEach((keyPath) => {
            const { isGetted, val } = getVal(rootProxy, keyPath);
            if (isGetted) {
              const curVerPathMeta = getPrivateMeta(val);
              replaceMetaPartial(prevVerMeta, curVerPathMeta, key);
            }
          });

          pushKeyPath(curVerMeta, newKeyPath);
          setValByKeyPaths(rootSelf, curVerMeta.keyPaths, curVerMeta.self);

          mayNewNode = curVerMeta.keyPaths.length === 1;
          apiCtx.metaMap.set(curVerMeta.copy, curVerMeta);

          value = val;
        }

        if (readOnly) {
          execOnOperate(OP_SET, key, { parentMeta, isChanged: false, value });
          return warnReadOnly();
        }

        // speed up array operation
        if (parentMeta && parentMeta.selfType === ARRAY) {
          // @ts-ignore
          if (parentMeta.copy && parentMeta.__callSet && canBeNum(key)) {
            const ret = execOnOperate(OP_SET, key, { parentMeta, value });
            value = ret.replacedValue;
            parentMeta.copy[key] = value;
            return true;
          }
          // @ts-ignore, mark is set called on parent node
          parentMeta.__callSet = true;
        }

        let isChanged = false;
        if (!onOperate) {
          // 变化之后取 copy 比较
          const node = parentMeta.modified ? parentMeta.copy : parentMeta.self;
          isChanged = node[key] !== value;
        } else {
          const ret = execOnOperate(OP_SET, key, { parentMeta, value });
          value = ret.replacedValue;
          isChanged = ret.isChanged;
        }

        if (isChanged) {
          handleDataNode(parent, {
            parentMeta,
            key,
            value,
            metaVer,
            calledBy: OP_SET,
            apiCtx,
            isValueDraft,
            mayNewNode,
          });
        }

        return true;
      },
      // delete or Reflect.deleteProperty will trigger this trap
      deleteProperty: (parent: any, key: any) => {
        if (isDraftFinished) {
          return logChangeFailed(OP_DEL, key);
        }

        const parentMeta = getSafeDraftMeta(parent, apiCtx);
        const value = parent[key];
        if (readOnly) {
          execOnOperate(OP_DEL, key, { parentMeta, isChanged: false, value });
          return warnReadOnly();
        }

        execOnOperate(OP_DEL, key, { parentMeta, isChanged: true, value });
        handleDataNode(parent, {
          parentMeta,
          op: OP_DEL,
          key,
          value: '',
          metaVer,
          calledBy: 'deleteProperty',
          apiCtx,
        });

        return true;
      },
      // trap function call
      apply: function (target: any, thisArg: any, args: any[]) {
        return target.apply(thisArg, args);
      },
    };

    return {
      createDraft: <T = ObjectLike>(mayDraft: T): T => {
        if (isPrimitive(mayDraft)) {
          throw new Error('base state can not be primitive');
        }
        let oriBase = mayDraft;

        const draftMeta = getSafeDraftMeta(mayDraft, apiCtx);
        if (draftMeta) {
          // 总是返回同一个 immutBase 代理对象
          if (immutBase && draftMeta.isImmutBase) {
            return draftMeta.proxyVal as T;
          }
          oriBase = draftMeta.self;
        }

        const meta = createScopedMeta('', oriBase, {
          ver: metaVer,
          traps: limuTraps,
          immutBase,
          readOnly,
          compareVer,
          apiCtx,
          hasOnOperate,
          autoRevoke,
        });
        recordVerScope(meta);
        meta.execOnOperate = execOnOperate;
        FINISH_HANDLER_MAP.set(meta.proxyVal, limuApis.finishDraft);

        return meta.proxyVal as T;
      },
      finishDraft: (proxyDraft: any) => {
        // attention: if pass a revoked proxyDraft
        // it will throw: Cannot perform 'set' on a proxy that has been revoked
        const rootMeta = getSafeDraftMeta(proxyDraft, apiCtx);
        if (!rootMeta) {
          throw new Error('rootMeta should not be null!');
        }
        if (rootMeta.level !== 0) {
          throw new Error('can not finish sub draft node!');
        }

        // TODO support fastCopy

        // immutBase 是一个一直可用的代理对象（不会被revoke）
        // 对 immut() 返回的对象调用 finishDraft 则总是返回 immutBase 自身代理
        // 将 immut() 返回结果传给 finishDraft 是无意义的
        if (rootMeta.isImmutBase) {
          return proxyDraft;
        }

        let final = extractFinalData(rootMeta, apiCtx);
        if (autoFreeze && canFreezeDraft) {
          // TODO deep pruning
          // see https://github.com/immerjs/immer/issues/687
          // let cachedFrozenOriginalBase = frozenOriginalBaseMap.get(rootMeta.originalSelf);
          final = deepFreeze(final);
        }
        ROOT_CTX.delete(metaVer);

        isDraftFinished = true;
        return final;
      },
    };
  })();

  return limuApis;
}
