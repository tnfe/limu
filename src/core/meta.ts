/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { AnyObject, DraftMeta, IApiCtx, ObjectLike, RootCtx } from '../inner-types';
import { META_KEY, META_VER } from '../support/consts';
import { verWrap } from '../support/inner-data';
import { getDataType, injectMetaProto, noop } from '../support/util';

export const ROOT_CTX: RootCtx = new Map();

export function markModified(meta: DraftMeta) {
  meta.rootMeta.modified = true;
  const doMark = (meta: DraftMeta | null) => {
    if (meta && !meta.modified) {
      meta.modified = true;
      doMark(meta.parentMeta);
    }
  };

  doMark(meta);
}

export function attachMeta(dataNode: any, meta: DraftMeta, options: { fast: boolean; apiCtx: IApiCtx }) {
  if (options.apiCtx.debug) {
    const { fast } = options;
    // speed up read performance when debug is true, especially for array forEach scene
    if (fast) {
      dataNode[META_KEY] = meta;
    } else {
      injectMetaProto(dataNode);
      dataNode.__proto__[META_KEY] = meta;
    }
  }

  return dataNode;
}

export function getKeyPath(draftNode: any, curKey: string, apiCtx: IApiCtx) {
  const pathArr: string[] = [curKey];
  const meta = getSafeDraftMeta(draftNode, apiCtx);
  if (meta && meta.level > 0) {
    const { keyPath } = meta;
    return [...keyPath, curKey];
  }
  return pathArr;
}

export function newMeta(baseData: any, options: any) {
  const { ver, parentMeta = null, key, immutBase, compareVer, apiCtx } = options;
  const dataType = getDataType(baseData);

  let keyPath: string[] = [];
  let level = 0;
  let copy = null;
  if (parentMeta) {
    copy = parentMeta.copy;
    level = getNextMetaLevel(copy, apiCtx);
    keyPath = getKeyPath(copy, key, apiCtx);
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
    isImmutBase: immutBase,
    isDel: false,
    isFast: false,
    isArrOrderChanged: false,
    newNodeStats: {},
    newNodeMap: new Map(),
    newNodes: [],
    ver,
    compareVer,
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
 * 是否是一个草稿对象代理节点
 */
export function isDraft(mayDraft: any) {
  const meta = getDraftProxyMeta(mayDraft);
  if (!meta) {
    return false;
  }

  return !meta.isImmutBase;
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

export function getNextMetaLevel(mayContainMetaObj: any, apiCtx: IApiCtx) {
  const meta = getDraftMeta(mayContainMetaObj, apiCtx);
  return meta ? meta.level + 1 : 1;
}

export function getSafeDraftMeta<T extends ObjectLike = ObjectLike>(proxyDraft: T, apiCtx: IApiCtx): DraftMeta<T> {
  // @ts-ignore
  return apiCtx.metaMap.get(proxyDraft);
}

export function getDraftMeta(proxyDraft: any, apiCtx?: IApiCtx): DraftMeta<any> | null {
  let apiCtxVar = apiCtx || getApiCtx(proxyDraft);
  return apiCtxVar?.metaMap.get(proxyDraft) || null;
}

export function getMetaVer(mayDraftProxy: any): string {
  return mayDraftProxy ? mayDraftProxy[META_VER] || '' : '';
}

export function getApiCtx(mayDraftProxy: any) {
  const ver = getMetaVer(mayDraftProxy);
  return ROOT_CTX.get(ver) || null;
}

export function getDraftProxyMeta(mayDraftProxy: any) {
  const apiCtx = getApiCtx(mayDraftProxy);
  if (!apiCtx) {
    return null;
  }
  return apiCtx.metaMap.get(mayDraftProxy) || null;
}

export function isDiff(val1: any, val2: any) {
  const meta1 = getDraftProxyMeta(val1);
  const meta2 = getDraftProxyMeta(val2);
  if (!meta1 && !meta2) {
    return !Object.is(val1, val2);
  }

  const {
    self: self1,
    modified: modified1,
    compareVer: cv1,
    ver: ver1,
    level: level1,
  } = meta1 || { self: val1, modified: false, compareVer: false, ver: '0', level: 0 };
  const {
    self: self2,
    modified: modified2,
    compareVer: cv2,
    ver: ver2,
    level: level2,
  } = meta2 || { self: val2, modified: false, compareVer: false, ver: '0', level: 0 };
  if (self1 !== self2) {
    // self 是内部维护的值，可不用 Object.is 判断
    return true;
  }
  if ((cv1 || cv2) && (level1 === 0 || level2 === 0) && ver1 !== ver2) {
    return true;
  }

  return modified1 || modified2;
}

/**
 * 浅比较两个对象，除了专用于比较 helux 生成的代理对象，此函数还可以比较普通对象
 * ```txt
 * true：两个对象一样
 * false：两个对象不一样
 * ```
 */
export function shallowCompare(prevObj: AnyObject, nextObj: AnyObject, compareLimuProxyRaw = true) {
  const diffFn = compareLimuProxyRaw ? isDiff : Object.is;
  const isObjDiff = (a: AnyObject, b: AnyObject) => {
    for (let i in a) if (!(i in b)) return true;
    for (let i in b) if (diffFn(a[i], b[i])) return true;
    return false;
  };
  const isEqual = !isObjDiff(prevObj, nextObj);
  return isEqual;
}
