/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { DraftMeta } from '../inner-types';
import { ARRAY, MAP, META_KEY, SET } from '../support/consts';
import { isObject } from '../support/util';
import { getSafeDraftMeta } from './meta';

function ressignArrayItem(listMeta: DraftMeta, itemMeta: DraftMeta, ctx: { targetNode: any; key: any }) {
  const { copy, isArrOrderChanged } = listMeta;
  const { targetNode, key } = ctx;
  // 数组顺序已变化
  if (isArrOrderChanged) {
    const key = copy.findIndex((item: any) => item === itemMeta.copy);
    if (key >= 0) {
      copy[key] = targetNode;
    }
    return;
  }

  copy[key] = targetNode;
}

export function isInSameScope(mayDraftNode: any, callerScopeVer: string) {
  if (!isObject(mayDraftNode)) {
    return true;
  }
  return getSafeDraftMeta(mayDraftNode).ver === callerScopeVer;
}

export function clearScopes(rootMeta: DraftMeta) {
  rootMeta.scopes.forEach((meta) => {
    const { modified, copy, parentMeta, key, self, revoke, proxyVal, isDel, isFast } = meta;

    if (!copy) return revoke();
    // TODO: 优化此处的delete
    if (isFast) {
      // @ts-ignore
      delete copy[META_KEY];
    } else {
      delete copy.__proto__[META_KEY];
    }

    if (!parentMeta) return revoke();

    const targetNode = !modified ? self : copy;
    // 父节点是 Map、Set 时，parent 指向的是 ProxyItems，这里取到 copy 本体后再重新赋值
    const parentCopy = parentMeta.copy as any;
    const parentType = parentMeta.selfType;

    if (parentType === MAP) {
      parentCopy.set(key, targetNode);
      return revoke();
    }
    if (parentType === SET) {
      parentCopy.delete(proxyVal);
      parentCopy.add(targetNode);
      return revoke();
    }
    if (parentType === ARRAY) {
      ressignArrayItem(parentMeta, meta, { targetNode, key });
      return revoke();
    }
    if (isDel !== true) {
      parentCopy[key] = targetNode;
      return revoke();
    }
  });

  rootMeta.scopes.length = 0;
}

export function extraFinalData(rootMeta: DraftMeta) {
  const { self, copy, modified } = rootMeta;
  let final = self;
  // 有 copy 不一定有修改行为，这里需做双重判断
  if (copy && modified) {
    final = rootMeta.copy;
  }
  // if put this on first line, fail at test/set-other/update-object-item.ts
  clearScopes(rootMeta);
  return final;
}

export function recordVerScope(meta: DraftMeta) {
  meta.rootMeta.scopes.push(meta);
}
