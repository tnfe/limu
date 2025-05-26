/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { DraftMeta, IApiCtx } from '../inner-types';
import { ARRAY, MAP, SET } from '../support/consts';
import { deepDrill, isObject } from '../support/util';
import { getDraftMeta, getMetaVer } from './meta';

function ressignArrayItem(listMeta: DraftMeta, itemMeta: DraftMeta, ctx: { targetNode: any; key: any }) {
  const { copy, isArrOrderChanged } = listMeta;
  const { targetNode, key } = ctx;
  // 数组顺序已变化
  if (isArrOrderChanged) {
    // fix issue https://github.com/tnfe/limu/issues/13
    // 元素经过 sort 后，可能已变成 proxy 对象，所以这里需要比较 copy 和 proxyVal
    const key = copy.findIndex((item: any) => item === itemMeta.copy || item === itemMeta.proxyVal);
    if (key >= 0) {
      copy[key] = targetNode;
    }
    return;
  }

  copy[key] = targetNode;
}

export function isInSameScope(mayDraftProxy: any, callerScopeVer: string) {
  if (!isObject(mayDraftProxy)) {
    return true;
  }
  return getMetaVer(mayDraftProxy) === callerScopeVer;
}

export function clearScopes(rootMeta: DraftMeta, apiCtx: IApiCtx) {
  const { metaMap } = apiCtx;

  // TODO 下钻有一定的性能损耗，允许用户关闭此逻辑 findDraftNodeNewRef=false
  const drilledMap: Map<any, any> = new Map();
  apiCtx.newNodeMap.forEach((v) => {
    const { node, parent, key } = v;
    const drilledNode = drilledMap.get(node);
    if (drilledNode) {
      // 同一个节点被多个父级引用了，只需要指向自身即可，无需再次下钻
      parent[key] = drilledNode;
      return;
    }
    const item = v;
    deepDrill(node, parent, key, (obj: any, parentObj: any, key: any) => {
      const meta = getDraftMeta(obj, apiCtx);
      if (meta) {
        const { modified, copy, self } = meta;
        const targetNode = !modified ? self : copy;
        parentObj[key] = targetNode;
      }
    });
    item.target = parent[key]; // 此处可能已被替换为真正的目标节点
    drilledMap.set(node, item.target);
  });

  rootMeta.scopes.forEach((meta) => {
    const { modified, copy, parentMeta, key, self, revoke, proxyVal, isDel } = meta;
    // LABEL: WAIT TEST(2025-05-25)
    const leaveScope = () => {
      metaMap.delete(self);
      metaMap.delete(proxyVal);
      // 这里还不能将 copy 的映射删除，否则会照成以下错误，留给 js 引擎自己清理即可
      // fail at test/api/setAutoRevoke.ts -> set autoRevoke when call createDraft › read subNode
      // metaMap.delete(copy);
      revoke();
    };

    if (!copy || !parentMeta) return leaveScope();

    const targetNode = !modified ? self : copy;
    // 父节点是 Map、Set 时，parent 指向的是 ProxyItems，这里取到 copy 本体后再重新赋值
    const parentCopy = parentMeta.copy as any;
    const parentType = parentMeta.selfType;

    if (parentType === MAP) {
      parentCopy.set(key, targetNode);
      return leaveScope();
    }
    if (parentType === SET) {
      parentCopy.delete(proxyVal);
      parentCopy.add(targetNode);
      return leaveScope();
    }
    if (parentType === ARRAY) {
      ressignArrayItem(parentMeta, meta, { targetNode, key });
      return leaveScope();
    }
    if (isDel !== true) {
      parentCopy[key] = targetNode;
      return leaveScope();
    }
  });

  rootMeta.scopes.length = 0;
}

export function extractFinalData(rootMeta: DraftMeta, apiCtx: IApiCtx) {
  const { self, copy, modified } = rootMeta;
  let final = self;
  // 有 copy 不一定有修改行为，这里需做双重判断
  if (copy && modified) {
    final = rootMeta.copy;
  }
  // if put this on first line, fail at test/set-other/update-object-item.ts
  clearScopes(rootMeta, apiCtx);
  return final;
}

export function recordVerScope(meta: DraftMeta) {
  meta.rootMeta.scopes.push(meta);
}
