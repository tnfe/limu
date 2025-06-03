/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { IS_RAW } from '../support/consts';
import { isPrimitive } from '../support/util';
import { deepCopy } from './copy';
import { getDraftMeta } from './meta';

export function original<T extends any = any>(mayDraftProxy: T): T {
  if (!mayDraftProxy) {
    return mayDraftProxy;
  }
  const meta = getDraftMeta(mayDraftProxy);
  // use ternary conditional operator instead of meta?.self
  // avoid generating redundant compiled code
  const self = meta ? meta.self : mayDraftProxy;
  return self as T;
}

export function current<T extends any = any>(mayDraftProxy: T): T {
  if (!mayDraftProxy) {
    return mayDraftProxy;
  }
  const meta = getDraftMeta(mayDraftProxy);
  if (!meta) {
    return mayDraftProxy;
  }

  return deepCopy(meta.copy || meta.self) as T;
}

export function markRaw<T extends any = any>(rawVal: T): T {
  if (!rawVal || isPrimitive(rawVal)) return rawVal;
  (rawVal as any)[IS_RAW] = true;
  return rawVal;
}
