/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { DraftMeta } from '../inner-types';
import {
  ARRAY,
  CAREFUL_FNKEYS,
  MAP,
  SET,
  SHOULD_REASSIGN_ARR_METHODS,
  SHOULD_REASSIGN_MAP_METHODS,
  SHOULD_REASSIGN_SET_METHODS,
} from '../support/consts';
import { isFn } from '../support/util';
import { getUnProxyValue } from './helper';
import { getUnsafeDraftMeta, markModified } from './meta';

function mayMarkModified(options: { calledBy: string; parentMeta: DraftMeta; op: string; parentType: string; key: string | number }) {
  const { calledBy, parentMeta, op, parentType } = options;
  // 对于由 set 陷阱触发的 handleDataNode 调用，需要替换掉爷爷数据节点 key 指向的 value
  if (
    ['deleteProperty', 'set'].includes(calledBy) ||
    (calledBy === 'get' &&
      ((parentType === SET && SHOULD_REASSIGN_SET_METHODS.includes(op)) || // 针对 Set.add
        (parentType === ARRAY && SHOULD_REASSIGN_ARR_METHODS.includes(op)) || // 针对 Array 一系列的改变操作
        (parentType === MAP && SHOULD_REASSIGN_MAP_METHODS.includes(op)))) // 针对 Map 一系列的改变操作
  ) {
    markModified(parentMeta);
  }
}

export function handleDataNode(parentDataNode: any, copyCtx: any) {
  const { op, key, value: mayProxyValue, calledBy, parentType, parentMeta } = copyCtx;
  // https://javascript.info/json#custom-tojson
  // 兼容 JSON.stringify 调用
  if (op === 'toJSON' && !mayProxyValue) {
    return;
  }

  /**
   * 防止 value 本身就是一个 Proxy
   * var draft_a1_b = draft.a1.b;
   * draft.a2 = draft_a1_b;
   */
  const value = getUnProxyValue(mayProxyValue);

  /**
   * 链路断裂，此对象未被代理
   * // draft = { a: { b: { c: 1 } }};
   * const newData = { n1: { n2: 2 } };
   * draft.a = newData;
   * draft.a.n1.n2 = 888; // 此时 n2_DataNode 是未代理对象
   */
  if (!parentMeta) {
    parentDataNode[key] = value;
    return;
  }

  const { self, copy: parentCopy } = parentMeta;
  mayMarkModified({ calledBy, parentMeta, op, key, parentType });

  // 是 Map, Set, Array 类型的方法操作或者值获取
  const fnKeys = CAREFUL_FNKEYS[parentType] || [];
  // 是函数调用
  if (fnKeys.includes(op) && isFn(mayProxyValue)) {
    // slice 操作无需使用 copy，返回自身即可
    if ('slice' === op) {
      return self.slice;
    }
    if (parentCopy) {
      // 因为 Map 和 Set 里的对象不能直接操作修改，是通过 set 调用来修改的
      // 所以无需 bind(parentDataNodeMeta.proxyVal)， 否则会以下情况出现，
      // Method Map.prototype.forEach called on incompatible receiver
      // Method Set.prototype.forEach called on incompatible receiver
      // see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Called_on_incompatible_type
      if (parentType === SET || parentType === MAP) {
        // 注意 forEach 等方法已提前生成了 proxyItems，这里 bind 的目标优先取 proxyItems
        return parentCopy[op].bind(parentCopy);
      }
      return parentCopy[op];
    }
    return self[op].bind(self);
  }

  if (!parentCopy) {
    return value;
  }

  const oldValue = parentCopy[key];
  const tryMarkDel = () => {
    const oldValueMeta = getUnsafeDraftMeta(oldValue);
    oldValueMeta && (oldValueMeta.isDel = true);
  };
  // TODO: add test case
  const tryMarkUndel = () => {
    const valueMeta = getUnsafeDraftMeta(mayProxyValue);
    valueMeta && (valueMeta.isDel = false);
  };

  if (calledBy === 'deleteProperty') {
    const valueMeta = getUnsafeDraftMeta(mayProxyValue);
    // for test/complex/data-node-change case3
    if (valueMeta) {
      valueMeta.isDel = true;
    } else {
      // for test/complex/data-node-change (node-change 2)
      tryMarkDel();
    }
    delete parentCopy[key];
    return;
  }

  parentCopy[key] = value;
  // 谨防是 a.b = { ... } ---> a.b = 1 的变异赋值方式
  tryMarkDel();
  tryMarkUndel();
}
