/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { AnyObject, DraftMeta, IApiCtx, ObjectLike, RootCtx } from '../inner-types';
import { META_VER, PRIVATE_META, ARRAY } from '../support/consts';
import { genMetaId, genSourceId } from '../support/inner-data';
import { getDataType, noop } from '../support/util';
import { toKeyStrPath, getKeyStrByPath, pushKeyPath, getVal, intersectPath, ensureStrKey } from './path-util';

/** multi ref data, sourceId 2 key */
/**
 * multi ref data: sourceId 2 key dict
 * key: srouceId, value: { fullKeyStr: [ [path1Arr], [path2Arr] ] } 
 */
const MRDSid2KeyDict = new Map<any, Record<string, string[][]>>();

/**
 * multi ref data: sourceId 2 all multi ref keys list
 * key: sourceId, value: [ [ keyPath1, keyPath2 ], [ anotherKeyPath1, anotherKeyPath2 ] ],
 * 数组里每个元素代表一个相同对象的多个引用路径
 */
const MRDSid2PathsList = new Map<string, Array<string[][]>>();

const finalDataSourceId = new WeakMap<object, string>();

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

export function getKeyPath(draftNode: any, curKey: string, apiCtx: IApiCtx) {
  const pathArr: string[] = [curKey];
  const meta = getSafeDraftMeta(draftNode, apiCtx);
  if (meta && meta.level > 0) {
    const { keyPath } = meta;
    return [...keyPath, curKey];
  }
  return pathArr;
}

export function newMeta(key: any, baseData: any, options: AnyObject & { parentMeta: DraftMeta }) {
  const { ver, parentMeta = null, immutBase, compareVer, apiCtx, hasOnOperate, fast } = options;
  const dataType = getDataType(baseData);

  let sourceId = options.sourceId;
  let keyPath: string[] = [];
  let keyStrPath: string[] = [];
  let arrKeyPath: string[] = [];
  let arrKeyPaths: string[][] = [];
  let keyStrPaths: string[][] = [];
  let keyPaths: string[][] = [];
  const keyStr = ensureStrKey(key);

  let level = 0;
  let copy: any = null;
  if (parentMeta) {
    sourceId = parentMeta.sourceId;
    copy = parentMeta.copy;
    level = getNextMetaLevel(copy, apiCtx);
    const isParentArr = parentMeta.selfType === ARRAY;
    arrKeyPath = isParentArr ? parentMeta.keyPath.concat(key) : parentMeta.arrKeyPath;

    keyPath = getKeyPath(copy, key, apiCtx);
    keyStrPath = toKeyStrPath(keyPath);

    if (!fast) {
      // 尝试查出记录的多引用关系
      let paths: string[][] = [];
      // 当前节点本身也是可由数组下标访问到的
      if (parentMeta.arrKeyPath.length) {
        const keyStr = getKeyStrByPath(parentMeta.arrKeyPath, true);
        const parentPaths = getMultiRefPathsByKey(sourceId, keyStr);
        paths = intersectPath(keyPath, parentPaths);
      }
      if (!paths.length) {
        const { keyStrPathStr } = parentMeta;
        const fullKeyStr = keyStrPathStr ? `${keyStrPathStr}|${keyStr}` : keyStr;
        paths = getMultiRefPathsByKey(sourceId, fullKeyStr);
      }

      if (paths.length > 1) {
        // draft 结束后再次创建草稿，发现了多引用路径
        const { copy: rootRaw } = parentMeta.rootMeta;
        const { val: curNode } = getVal(rootRaw, keyPath);

        const toDelIdxList: number[] = [];
        let isNodeParentArr = false;
        const mayArrKeyPaths: string[][] = [];

        paths.forEach((keyPath, idx) => {
          const { val: tmpNode } = getVal(rootRaw, keyPath);
          if (!isNodeParentArr) {
            const parentKeyPath = keyPath.slice(0, keyPath.length - 1);
            const { val: parentNode } = getVal(rootRaw, parentKeyPath);
            if (Array.isArray(parentNode)) {
              // 只有有一条路径上确认了该节点是数组下标索引到节点，即可标识 isNodeParentArr 为 true
              isNodeParentArr = true;
            }
          }

          // 当前节点还是上一个版本的节点
          if (tmpNode === curNode) {
            keyPaths.push(keyPath);
            keyStrPaths.push(toKeyStrPath(keyPath));
            mayArrKeyPaths.push(keyPath);
          } else {
            toDelIdxList.push(idx);
          }
        });

        if (isNodeParentArr) {
          arrKeyPaths = mayArrKeyPaths;
        }

        // 移除已不再是共同引用的路径记录
        toDelIdxList.forEach(idx => paths.splice(idx, 1));
      } else if (parentMeta.keyPaths.length > 0) {
        // 父节点上可能有多路径，转移到子节点的 keyPaths keyStrPaths 里
        parentMeta.keyPaths.forEach((keyPath) => {
          const curKeyPath = keyPath.concat(key);
          keyPaths.push(curKeyPath);
          keyStrPaths.push(toKeyStrPath(curKeyPath));
        });
      } else {
        keyPaths = [keyPath];
        keyStrPaths = [keyStrPath];
      }
    }
  }

  if (!arrKeyPath.length && arrKeyPaths.length) {
    arrKeyPath = arrKeyPaths[0];
  }
  if (arrKeyPath.length && !arrKeyPaths.length) {
    arrKeyPaths.push(arrKeyPath);
  }

  const keyStrPathStr = parentMeta ? `${parentMeta.keyStrPathStr}|${keyStr}` : keyStr;

  const meta: DraftMeta = {
    id: genMetaId(),
    sourceId,
    // @ts-ignore add later
    rootMeta: null,
    parentMeta,
    parent: copy,
    selfType: dataType,
    self: baseData,
    // @ts-ignore add later
    copy: null,
    key,
    keyStr,
    keyPath,
    keyStrPath,
    keyStrPathStr,
    keyPaths,
    keyStrPaths,
    arrKeyPath,
    arrKeyPaths,
    level,
    // @ts-ignore add later
    /** @type any */
    proxyVal: null as any,
    proxyItems: null,
    modified: false,
    scopes: [],
    /**
     * 当前对象 是否是一个一直可用的代理对象（不会被revoke），
     * 服务于 immut 接口
     */
    isImmutBase: immutBase,
    isDel: false,
    isArrOrderChanged: false,
    newNodeStats: {},
    newNodeMap: new Map(),
    newNodes: [],
    ver,
    compareVer,
    revoke: noop,
    hasOnOperate,
    execOnOperate: noop,
  };

  if (level === 0) {
    meta.rootMeta = meta;
  } else {
    // @ts-ignore 这里 parentMeta 一定有值
    meta.rootMeta = parentMeta.rootMeta;
  }

  return meta;
}

/**
 * 是否是一个当前版本对应的草稿对象代理节点
 */
export function isDraft(mayDraft: any) {
  if (!mayDraft) {
    return false;
  }
  const meta = getDraftProxyMeta(mayDraft);
  if (!meta) {
    return false;
  }

  return !meta.isImmutBase;
}

export function getNextMetaLevel(mayContainMetaObj: any, apiCtx: IApiCtx) {
  const meta = getDraftMetaByCtx(mayContainMetaObj, apiCtx);
  return meta ? meta.level + 1 : 1;
}

export function getSafeDraftMeta<T = ObjectLike>(proxyDraft: T, apiCtx: IApiCtx): DraftMeta<T> {
  // @ts-ignore
  return apiCtx.metaMap.get(proxyDraft);
}

export function getDraftMetaByCtx(mayProxyDraft: any, apiCtx: IApiCtx): DraftMeta<any> | null {
  if (!mayProxyDraft) {
    return null;
  }
  if (apiCtx) {
    return apiCtx.metaMap.get(mayProxyDraft) || null;
  }
  return getPrivateMeta(mayProxyDraft) || null;
}

export function getDraftMeta(mayProxyDraft: any): DraftMeta<any> | null {
  if (!mayProxyDraft) {
    return null;
  }
  return getPrivateMeta(mayProxyDraft) || null;
}

export function getMetaVer(mayDraftProxy: any): string {
  return mayDraftProxy ? mayDraftProxy[META_VER] || '' : '';
}

export function getApiCtx(mayDraftProxy: any) {
  const ver = getMetaVer(mayDraftProxy);
  return ROOT_CTX.get(ver) || null;
}

export function getDraftProxyMeta(mayDraftProxy: any) {
  return getPrivateMeta(mayDraftProxy) || null;
}

/**
 * 判断两个值是否相同，true 表示不相等，false 表示相等
 */
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

/**
 * 内部调用，相信 proxyData 是 limu 产生的代理数据
 */
export function getPrivateMeta(proxyData: any): DraftMeta {
  return proxyData[PRIVATE_META];
}

export function replaceMetaPartial(oldMeta: any, newMeta: any, key: any) {
  newMeta.copy = oldMeta.copy;
  newMeta.self = oldMeta.self;
  newMeta.parentMeta[key] = oldMeta.self;
}

export function getSourceId(rawData: any) {
  return finalDataSourceId.get(rawData) || genSourceId();
}

export function setSourceId(rawData: any, sourceId: string) {
  return finalDataSourceId.set(rawData, sourceId);
}

export function getMultiRefPathsDict(sourceId: any) {
  // get 时不创建，避免额外性能损耗
  return MRDSid2KeyDict.get(sourceId);
}

export function setMultiRefPaths(sourceId: string, key: string, paths: string[][]) {
  let dict = MRDSid2KeyDict.get(sourceId);
  if (!dict) {
    dict = {};
    MRDSid2KeyDict.set(sourceId, dict);
  }
  dict[key] = paths;
}


export function getMultiRefPathsByKey(sourceId: string, key: string): string[][] {
  const dict = getMultiRefPathsDict(sourceId);
  // 不写为 (dict || {})[key] || [] , 因为此写法性能较差一些
  if (!dict) {
    return [];
  }
  return dict[key] || [];
}

export function getMultiRefPaths(sourceId: string): Array<string[][]> {
  const paths = MRDSid2PathsList.get(sourceId) || [];
  return paths;
}

export function clearMultiRefData(sourceId: string, toClearIdxList: number[], toClearKeyStrList: string[]) {
  const dict = MRDSid2KeyDict.get(sourceId);
  if (dict) {
    toClearKeyStrList.forEach(keyStr => Reflect.deleteProperty(dict, keyStr));
  }

  const pathsList = MRDSid2PathsList.get(sourceId) || [];
  // @ts-ignore
  const newPathsList = pathsList.filter((v, idx) => !toClearIdxList.includes(idx));
  MRDSid2PathsList.set(sourceId, newPathsList);
}

export function recordMultiRefData(meta: DraftMeta, keyStrs: string[]) {
  const { sourceId, keyPaths } = meta;
  keyStrs.forEach((keyStr) => setMultiRefPaths(sourceId, keyStr, keyPaths));
  // [[1,2,3],[4,5,6]], [[a,b],[x]], ...
  const pathsList = MRDSid2PathsList.get(sourceId) || [];

  const keyStrsOfKP = keyPaths.map(keyPath => getKeyStrByPath(keyPath, true));
  let matched = false;
  out: for (const paths of pathsList) {
    for (const keyPath of paths) {
      const curKeyStr = getKeyStrByPath(keyPath, true);
      if (keyStrsOfKP.includes(curKeyStr)) {
        const keyStrsOfPaths = paths.map(keyPath => getKeyStrByPath(keyPath, true));
        keyPaths.forEach((keyPath, idx) => {
          if (!keyStrsOfPaths.includes(keyStrsOfKP[idx])) {
            paths.push(keyPath);
          }
        });
        matched = true;
        break out;
      }
    }
  }

  if (!matched) {
    pathsList.push(keyPaths);
  }

  MRDSid2PathsList.set(sourceId, pathsList);
}

/**
 * 将某个草稿对象（代理对象）赋值到另一个地方，例如： draft.current = draft.list[0];
 * 将重建路径连接关系
 */
export function mayRelinkPath(key: string, parentMeta: DraftMeta, valueMeta: DraftMeta | null) {
  let proxyVal: any = null;
  const shouldRelink = valueMeta && valueMeta.parentMeta !== parentMeta;
  if (!shouldRelink) {
    return proxyVal;
  }

  const prevKeyPath = valueMeta.keyPath;
  const newKeyPath = parentMeta.keyPath.concat(key);
  const prevKeyStrPath = toKeyStrPath(prevKeyPath);
  const newKeyStrPath = toKeyStrPath(newKeyPath);

  const prevKeyStr = prevKeyStrPath.join('|');
  const newKeyStr = newKeyStrPath.join('|');
  if (prevKeyStr !== newKeyStr) {
    // 发现一条新的路径指向当前 value，说明存在多引用
    pushKeyPath(valueMeta, newKeyPath, newKeyStrPath);
    recordMultiRefData(valueMeta, [prevKeyStr, newKeyStr]);

    // if (valueMeta.modified) {
    //   let curKey = key;
    //   let curMeta = valueMeta;
    //   let curPMeta = parentMeta;
    //   do {
    //     curPMeta.copy[curKey] = curMeta.copy;
    //     curPMeta.modified = true;

    //     curKey = curPMeta.key;
    //     curMeta = curPMeta;
    //     // @ts-ignore
    //     curPMeta = curPMeta.parentMeta;
    //   } while (curPMeta);
    // }

    const modified = valueMeta.modified;
    let curKey = key;
    let curMeta = valueMeta;
    let curPMeta = parentMeta;
    do {
      curPMeta.copy[curKey] = curMeta.copy;
      curPMeta.modified = modified;

      curKey = curPMeta.key;
      curMeta = curPMeta;
      // @ts-ignore
      curPMeta = curPMeta.parentMeta;
    } while (curPMeta);
    proxyVal = valueMeta.proxyVal;
  }

  return proxyVal;
}
