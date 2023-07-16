
/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { DraftMeta, ObjectLike } from '../inner-types';
import { getDraftMeta, isDraft } from './meta'
import { deepCopy } from './copy'

export function original<T extends ObjectLike = ObjectLike, Trust extends boolean = true>(
  mayDraftNode: T,
  trustLimu?: Trust,
): Trust extends true ? T : (T | null) {
  if (!isDraft(mayDraftNode)) {
    return mayDraftNode;
  }

  const meta = getDraftMeta<T>(mayDraftNode);
  const self = meta?.self || null;
  if (trustLimu) {
    // 正常情况一定能获取到 meta.self 的
    return self as T;
  }
  return self;
}


export function current<T extends ObjectLike = ObjectLike>(mayDraftNode: T): T {
  // TODO: 考虑添加 trustLimu 参数，和 original 保持一致？
  if (!isDraft(mayDraftNode)) {
    return mayDraftNode;
  }

  const meta = getDraftMeta<T>(mayDraftNode) as DraftMeta<T>;
  return deepCopy(meta.copy || meta.self);
}