/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { DraftMeta, ObjectLike } from '../inner-types';
import { META_KEY } from '../support/consts';
import { verWrap } from '../support/inner-data';
import { isPrimitive, getDataType, noop, injectMetaProto } from '../support/util';


export function markModified(meta: DraftMeta) {
  meta.rootMeta.modified = true;
  const doMark = (meta: DraftMeta | null) => {
    if (meta) {
      meta.modified = true;
      doMark(meta.parentMeta);
    }
  };

  doMark(meta);
};


export function attachMeta(dataNode: any, meta: DraftMeta, fast: boolean) {
  if (fast) {
    dataNode[META_KEY] = meta; // speed up read performance, especially for array forEach scene
  } else {
    injectMetaProto(dataNode);
    dataNode.__proto__[META_KEY] = meta;
  }
  return dataNode;
}


export function getKeyPath(draftNode: any, curKey: string) {
  const pathArr: string[] = [curKey];
  const meta = getDraftMeta(draftNode);
  if (meta && meta.level > 0) {
    const { keyPath } = meta;
    return [...keyPath, curKey];
  }
  return pathArr;
}


export function newMeta(baseData: any, options: any) {
  const { finishDraft, ver, parentMeta = null, key } = options;
  const dataType = getDataType(baseData);

  let keyPath: string[] = [];
  let level = 0;
  let copy = null;
  if (parentMeta) {
    copy = parentMeta.copy;
    level = getNextMetaLevel(copy);
    keyPath = getKeyPath(copy, key);
  }

  const meta: DraftMeta = {
    // @ts-ignore add later
    rootMeta: null,
    parentMeta,
    parent: copy,
    selfType: dataType,
    self: baseData,
    // @ts-ignore add later
    copy: null,
    key,
    keyPath,
    level,
    // @ts-ignore add later
    /** @type any */
    proxyVal: null as any,
    proxyItems: null,
    modified: false,
    scopes: [],
    isDel: false,
    linkCount: 1,
    finishDraft,
    ver,
    revoke: noop,
  };
  if (level === 0) {
    meta.rootMeta = meta;
  } else {
    meta.rootMeta = parentMeta.rootMeta;
  }
  return meta;
}


/**
 * 是否是 proxy 代理指向的草稿对象
 * @param mayDraft
 * @returns
 */
export function isDraft(mayDraft: any) {
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


export function getNextMetaLevel(mayContainMetaObj: any) {
  const meta = getDraftMeta(mayContainMetaObj);
  return meta ? meta.level + 1 : 1;
}


export function getDraftMeta<T extends ObjectLike = ObjectLike>(proxyDraft: T): DraftMeta<T> {
  // @ts-ignore
  return proxyDraft[META_KEY];
}


export function getUnsafeDraftMeta<T extends ObjectLike = ObjectLike>(proxyDraft: T): DraftMeta<T> | null {
  // @ts-ignore
  return proxyDraft ? proxyDraft[META_KEY] : null;
}
