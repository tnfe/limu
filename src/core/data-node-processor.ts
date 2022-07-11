/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Tencent Corporation. All rights reserved.
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { isPrimitive, canHaveProto, canBeNum, isSymbol, isFn } from '../support/util';
import { ver2MetasList } from '../support/inner-data';
import { metasKey } from '../support/symbols';
import {
  carefulDataTypes, carefulType2fnKeys,
  arrIgnoreFnOrAttributeKeys,
  mapIgnoreFnOrAttributeKeys,
  setIgnoreFnOrAttributeKeys,
  carefulType2fnKeysThatNeedMarkModified,
} from '../support/consts';
import {
  getMeta,
  getUnProxyValue,
  getKeyPath,
  makeCopy,
  getRealProto,
  setMetasProto,
  reassignGrandpaAndParent,
  // isDraft,
} from './helper';
import { DraftMeta } from '../inner-types';

// slice、concat 以及一些特殊的key取值等操作无需copy副本
function allowCopyForOp(parentType, op) {
  if (parentType === carefulDataTypes.Array) {
    if (arrIgnoreFnOrAttributeKeys.includes(op)) return false;
    if (canBeNum(op)) return false;
  }
  if (parentType === carefulDataTypes.Map && mapIgnoreFnOrAttributeKeys.includes(op)) {
    return false;
  }
  if (parentType === carefulDataTypes.Set && setIgnoreFnOrAttributeKeys.includes(op)) {
    return false;
  }
  // like Symbol(Symbol.isConcatSpreadable) in test case array-base/concat
  if (isSymbol(op)) {
    return false;
  }
  return true;
}


const SHOULD_REASSIGN_ARR_METHODS = ['push', 'pop', 'shift', 'splice', 'unshift', 'reverse', 'copyWithin', 'delete', 'fill'];
const SHOULD_REASSIGN_MAP_METHODS = ['clear', 'delete', 'set'];
const SHOULD_REASSIGN_SET_METHODS = ['add', 'clear', 'delete'];
function mayReassign(options: { calledBy: string, parentDataNodeMeta: DraftMeta, op: string, parentType: string, key: string | number }) {
  const { calledBy, parentDataNodeMeta, op, parentType, key } = options;
  // 对于由 set 陷阱触发的 copyAndGetDataNode 调用，需要替换掉爷爷数据节点 key 指向的 value
  if (['deleteProperty', 'set'].includes(calledBy)
    ||
    (calledBy === 'get' && (
      (parentType === 'Set' && SHOULD_REASSIGN_SET_METHODS.includes(op)) // 针对 Set.add
      || (parentType === 'Array' && SHOULD_REASSIGN_ARR_METHODS.includes(op)) // 针对 Array 一系列的改变操作
      || (parentType === 'Map' && SHOULD_REASSIGN_MAP_METHODS.includes(op)) // 针对 Array 一系列的改变操作
    ))
  ) {
    reassignGrandpaAndParent(parentDataNodeMeta, calledBy, key);
  }
}


export function copyAndGetDataNode(parentDataNode, copyCtx, isFirstCall) {
  const { op, key, value: mayProxyValue, metaVer, calledBy, parentType } = copyCtx;
  const parentDataNodeMeta = getMeta(parentDataNode, metaVer);

  /**
   * 防止 value 本身就是一个 Proxy
   * var draft_a1_b = draft.a1.b;
   * draft.a2 = draft_a1_b;
   */
  let value = mayProxyValue;
  if (isFirstCall) {
    // value 本身可能是代理对象
    value = getUnProxyValue(mayProxyValue, metaVer);
  }

  /**
   * 链路断裂，此对象未被代理
   * // draft = { a: { b: { c: 1 } }};
   * const newData = { n1: { n2: 2 } };
   * draft.a = newData;
   * draft.a.n1.n2 = 888; // 此时 n2_DataNode 是未代理对象
   */
  if (!parentDataNodeMeta) {
    parentDataNode[key] = value;
    return;
  }

  const { self, rootMeta } = parentDataNodeMeta;
  let { copy: parentCopy } = parentDataNodeMeta;

  const allowCopy = allowCopyForOp(parentType, op);

  if (allowCopy) {
    // 没有 copy 就通过 makeCopy 造一个 copy
    // 有了 copy 也要看parentType类型，如果是 'Map', 'Set' 的话，也需要 makeCopy
    // 因为此时 parentDataNodeMeta 携带的 proxyItems 才是正确的 copy 体
    // 否则在 test/complex/case1.ts 示例里，先调用了 mixArr.push，为 mixArr 每一个 item 项生成的copy
    // Map 的 copy 是 Proxy { Map: name=> {name:'bj'} }
    // 而我们需要的是 { Map: name=> Proxy {name:'bj'} }，否则导致测试失败
    if (!parentCopy || ['Map', 'Set'].includes(parentType)) {
      parentCopy = makeCopy(parentDataNodeMeta, parentCopy);
      // console.log('re parentCopy');
      parentDataNodeMeta.copy = parentCopy;
    }

    if (!isPrimitive(value)) {
      const valueMeta = getMeta(mayProxyValue, metaVer);
      if (valueMeta) {
        /**
         * 值的父亲节点和当时欲写值的数据节点层级对不上，说明节点发生了层级移动
         * 总是记录最新的父节点关系，防止原有的关系被解除
         * ------------------------------------------------------------
         * 
         * // 移动情况
         * // draft is { a: { b: { c: { d: { e: 1 } } } } }
         * const dValue = draft.a.b.c.d; // { e: 1 }
         * const cValue = draft.a.b.c; // cValue: { d: { e: 1 } }，此时 cValue 已被代理，parentLevel = 2
         * 
         * // [1]: dataNode: draft, key: 'a', value: cValue
         * draft.a = cValue; 
         * // parentLevel = 0, 数据节点层级出现移动
         * 
         * // [2]: dataNode: draft.a, key: 'b', value: cValue
         * draft.a.b = cValue; 
         * // parentLevel = 1, 数据节点层级出现移动
         *
         * // [3]: dataNode: draft.a.b, key: 'c', value: cValue
         * draft.a.b.c = cValue; 
         * // parentLevel = 2, 数据节点层级没有出现移动，还保持原来的关系
         *
         * ------------------------------------------------------------
         * // 关系解除情况
         * // draft is { a: { b: { c: { d: { e: 1 } } } }, a1: 2 }
         * const d = draft.a.b.c.d;
         * draft.a1 = d;
         * draft.a.b.c = null; // d属性数据节点和父亲关系解除
         */
        if (valueMeta.parentMeta && valueMeta.parentMeta.level !== parentDataNodeMeta.level) {
          // 修正 valueMeta 维护的相关数据
          valueMeta.parent = parentDataNodeMeta.self;
          valueMeta.level = parentDataNodeMeta.level + 1;
          valueMeta.key = key;
          valueMeta.keyPath = getKeyPath(valueMeta.parent, key, metaVer);

          /**
           * 父亲节点 P 和当时欲写值的数据节点 C 层级相等，也不能保证 C 向上链路的所有父辈们是否有过层级移动
           * 因为他们发生移动时，是不会去修改所有子孙的元数据的
           */
        } else {
          // thinking
        }

        /**
         * 还没为当前数据节点建立代理，就被替换了
         * // draft is { a: { b: { c: 1 } } }
         * draft.a = { b: { c: 100 } };
         */
      } else {
        // do nothing，会在将来 get 时触发代理对象创建
      }
    }

    // console.log('[[ DEBUG ]] mayReassign ', `calledBy:${calledBy}  parentType:${parentType} op:${op}`);
    mayReassign({ calledBy, parentDataNodeMeta, op, key, parentType });

    // 向上回溯，复制完整条链路，parentMeta 为 null 表示已回溯到顶层
    const grandpaMeta = parentDataNodeMeta.parentMeta;
    if (grandpaMeta) {
      const copyCtx = {
        key: parentDataNodeMeta.key, parentType: parentDataNodeMeta.parentType,
        value: parentCopy, metaVer, calledBy,
      };
      // console.log('向上回溯，复制完整条链路', copyCtx);
      copyAndGetDataNode(grandpaMeta.self, copyCtx, false);
    }
  }

  // 是 Map, Set, Array 类型的方法操作或者值获取
  const fnKeys = carefulType2fnKeys[parentType] || [];
  const markModified = () => {
    // 标记当前节点已更新
    parentDataNodeMeta.modified = true;
    rootMeta && (rootMeta.modified = true);
  };

  // 是函数调用
  if (fnKeys.includes(op) && isFn(mayProxyValue)) {
    const fnKeysThatNeedMarkModified = carefulType2fnKeysThatNeedMarkModified[parentType];
    if (fnKeysThatNeedMarkModified.includes(op)) {
      markModified();
    }

    // slice 操作无需使用 copy，返回自身即可
    if ('slice' === op) {
      // @ts-ignore
      return self.slice;
    } else if (parentCopy) {
      // 因为 Map 和 Set 里的对象不能直接操作修改，是通过 set 调用来修改的
      // 所以无需 bind(parentDataNodeMeta.proxyVal)， 否则会以下情况出现，
      // Method Map.prototype.forEach called on incompatible receiver
      // Method Set.prototype.forEach called on incompatible receiver
      // see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Called_on_incompatible_type
      if (parentType === carefulDataTypes.Set || parentType === carefulDataTypes.Map) {
        // 注意 forEach 等方法已提前生成了 proxyItems，这里 bind 的目标优先取 proxyItems
        return parentCopy[op].bind(parentCopy);
      }
      if (['map', 'sort'].includes(op)) {
        return parentCopy[op].bind(parentDataNodeMeta.proxyVal);
      }

      /**
       * ATTENTION_1
       * 确保回调里的参数能拿到代理对象，如
       * ```js
       * // 此处的 arr 需要转为代理对象，因为用户可能直接操作它修改数据
       * arr.forEach((value, index, arr)=>{...})
       * ```
       */
      return parentCopy[op].bind(parentDataNodeMeta.proxyItems);
    } else {
      return self[op].bind(self);
    }
  }

  if (!parentCopy) {
    return value;
  }

  // 处于递归调用则需要忽略以下逻辑（递归是会传递 isFirstCall 为 false ）
  if (isFirstCall) {
    if (op === 'del') {
      delete parentCopy[key];
    } else if (op === 'toJSON' && !mayProxyValue) {
      // 兼容 JSON.stringify 调用 
      return;
    } else {
      parentCopy[key] = value;
    }
  }

  if (['set', 'deleteProperty'].includes(calledBy)) {
    markModified();
  }
}

export function createMetaList(metaVer) {
  ver2MetasList[metaVer] = [];
}

export function clearAllDataNodeMeta(metaVer) {
  var metasList = ver2MetasList[metaVer];
  metasList.forEach(metas => delete metas[metaVer])
}


export function ensureDataNodeMetasProtoLayer(val, metaVer, throwError = false) {
  const canValHaveProto = canHaveProto(val);
  if (canValHaveProto) {
    let metas = val[metasKey];
    if (!metas) {
      setMetasProto(val, getRealProto(val));
      metas = val[metasKey];
    }

    ver2MetasList[metaVer].push(metas);
    return;
  }
  if (throwError) throw new Error('base state type can only be object(except null) or array');
}

/**
 * 节省一些判定，提高性能之用
 */
export function ensureDataNodeMetasProtoLayerFast(val, metaVer) {
  let metas = val[metasKey];
  if (!metas) {
    setMetasProto(val, getRealProto(val));
    metas = val[metasKey];
  }

  ver2MetasList[metaVer].push(metas);
}
