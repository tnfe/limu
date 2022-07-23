
// @ts-nocheck
import type { DraftMeta } from '../inner-types';
import { META_KEY } from '../support/symbols';
import { MAP, SET, ARRAY } from '../support/consts';
import { isObject } from '../support/util';
import { getDraftMeta } from './meta';


export function isInSameScope(mayDraftNode: any, callerScopeVer: string) {
  if (!isObject(mayDraftNode)) {
    return true;
  }
  const ret = getDraftMeta(mayDraftNode).ver === callerScopeVer;
  return ret;
}


export function clearScopes(rootMeta: DraftMeta) {
  rootMeta.scopes.forEach(meta => {
    const { modified, copy, parentMeta, key, self, parentType, revoke, proxyVal, isDel } = meta;

    if (!copy) return revoke();
    delete copy[META_KEY];

    if (!parentMeta) return revoke();

    const targetNode = !modified ? self : copy;
    // 父节点是 Map、Set 时，parent 指向的是 ProxyItems，这里取到 copy 本体后再重新赋值
    const parentCopy = parentMeta.copy as any;

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
      parentCopy[key] = targetNode;
      return revoke();
    }

    if (isDel !== true) {
      parentCopy[key] = targetNode;
      return revoke();
    }

    // Array or Object
    // parentCopy[key] = targetNode;
    // return revoke();
  });

  rootMeta.scopes.length = 0;
}


export function recordVerScope(meta: DraftMeta) {
  meta.rootMeta.scopes.push(meta);
}
