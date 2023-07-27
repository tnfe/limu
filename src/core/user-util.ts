/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { ObjectLike } from '../inner-types';
import { isPrimitive } from '../support/util';
import { deepCopy } from './copy';
import { getDraftMeta } from './meta';

export function original<T extends any = any>(mayDraftNode: T): T {
  if (isPrimitive(mayDraftNode)) {
    return mayDraftNode;
  }
  const meta = getDraftMeta(mayDraftNode as any);
  const self = meta?.self || mayDraftNode;
  return self as T;
}

export function current<T extends any = any>(mayDraftNode: T): T {
  if (isPrimitive(mayDraftNode)) {
    return mayDraftNode;
  }

  const meta = getDraftMeta(mayDraftNode as ObjectLike);
  if (!meta) {
    return mayDraftNode;
  }

  return deepCopy(meta.copy || meta.self) as T;
}
