/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { deepCopy } from './copy';
import { getDraftMeta } from './meta';

export function original<T extends any = any>(mayDraftProxy: T): T {
  const meta = getDraftMeta(mayDraftProxy);
  // use ternary conditional operator instead of meta?.self
  // avoid generating redundant compiled code
  const self = meta ? meta.self : mayDraftProxy;
  return self as T;
}

export function current<T extends any = any>(mayDraftProxy: T): T {
  const meta = getDraftMeta(mayDraftProxy);
  if (!meta) {
    return mayDraftProxy;
  }

  return deepCopy(meta.copy || meta.self) as T;
}
