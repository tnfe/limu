
/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { DraftMeta, ObjectLike } from '../inner-types';
import { getDraftMeta } from './meta'
import { isPrimitive } from '../support/util'
import { deepCopy } from './copy'

export function original<T extends any = any>(mayDraftNode: T): T {
  if (isPrimitive(mayDraftNode)) {
    return mayDraftNode;
  }
  const meta = getDraftMeta(mayDraftNode as any);
  const self = meta?.self || mayDraftNode;
  return self as T;
}


export function current<T extends ObjectLike = ObjectLike>(mayDraftNode: T): T {
  // TODO: 考虑添加 trustLimu 参数，和 original 保持一致？
  if (isPrimitive(mayDraftNode)) {
    return mayDraftNode;
  }

  const meta = getDraftMeta<T>(mayDraftNode) as DraftMeta<T>;
  if (!meta) {
    return mayDraftNode;
  }

  return deepCopy(meta.copy || meta.self);
}