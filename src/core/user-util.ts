/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { deepCopy } from './copy';
import { getDraftMeta } from './meta';

export function original<T extends any = any>(mayDraftNode: T): T {
  const meta = getDraftMeta(mayDraftNode);
  // use ternary conditional operator instead of meta?.self
  // avoid generating redundant compiled code
  const self = meta ? meta.self : mayDraftNode;
  return self as T;
}

export function current<T extends any = any>(mayDraftNode: T): T {
  const meta = getDraftMeta(mayDraftNode);
  if (!meta) {
    return mayDraftNode;
  }

  return deepCopy(meta.copy || meta.self) as T;
}
