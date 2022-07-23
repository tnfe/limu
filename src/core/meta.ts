
import type { DraftMeta, ObjectLike } from '../inner-types';
import { META_KEY } from '../support/symbols';
import { verWrap } from '../support/inner-data';
import { isPrimitive } from '../support/util';


export function attachMeta(dataNode: any, meta: DraftMeta) {
  dataNode[META_KEY] = meta;
  return dataNode;
}


/**
 * 是否是 proxy 代理指向的草稿对象
 * @param mayDraft
 * @returns
 */
export function isDraft(mayDraft) {
  if (isPrimitive(mayDraft)) {
    return false;
  }
  const meta = mayDraft[META_KEY];
  return !!meta;
}


export function genMetaVer() {
  if (verWrap.value >= Number.MAX_SAFE_INTEGER) {
    verWrap.value = 1;
    verWrap.usablePrefix += 1;
  } else {
    verWrap.value += 1;
  }

  const { value, usablePrefix } = verWrap;
  const metaVer = `${usablePrefix}_${value}`;
  return metaVer;
}


export function getNextMetaLevel(mayContainMetaObj) {
  const meta = getDraftMeta(mayContainMetaObj);
  return meta ? meta.level + 1 : 1;
}


export function getDraftMeta<T extends ObjectLike = ObjectLike>(proxyDraft: T): DraftMeta<T> {
  return proxyDraft[META_KEY];
}

