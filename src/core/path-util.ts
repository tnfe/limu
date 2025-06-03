import type { DraftMeta } from '../inner-types';
import { isMap, isSymbol } from '../support/util';
import { genSymbolId, symbolStrDict, strSymbolDict } from '../support/inner-data';

export function nodupPush(list: Array<string | number>, toPush: string | number) {
  if (!list.includes(toPush)) list.push(toPush);
}

export function ensureStrKey(maySymbolKey: any) {
  const key = maySymbolKey;
  if (!isSymbol(maySymbolKey)) {
    return maySymbolKey;
  }

  let symbolStr = symbolStrDict[key];
  if (!symbolStr) {
    symbolStr = genSymbolId();
    symbolStrDict[key] = symbolStr;
  }

  return symbolStr;
}

function getKeyPathIdx(keyPaths: string[][], keyPath: string[]) {
  const keyPathStrs = keyPaths.map(v => v.join('|'));
  const keyPathStr = keyPath.join('|');
  return keyPathStrs.indexOf(keyPathStr);
}

export function getKeyStrByPath(keyPath: string[], ensureStr?: boolean) {
  let target = keyPath;
  if (ensureStr) {
    target = toKeyStrPath(keyPath, true);
  }
  return target.join('|');
}

/**
 * in:  ['a', 'b', Symbol]
 * out: ['a', 'b', 'SID_1']
 */
export function toKeyStrPath(keyPath: string[], traversal?: boolean) {
  let keyStrPath: string[] = [];

  if (traversal) {
    keyPath.forEach((v) => {
      const keyStr = ensureStrKey(v);
      keyStrPath.push(keyStr);
    });
    return keyStrPath;
  }

  keyStrPath = keyPath.slice();
  const lastIdx = keyPath.length - 1;
  const lastKey = keyPath[lastIdx];
  const keyStr = ensureStrKey(lastKey);
  keyStrPath[lastIdx] = keyStr;
  return keyStrPath;
}

/**
 * out: ['a', 'b', 'SID_1']
 * in:  ['a', 'b', Symbol]
 */
export function toKeyPath(keyStrPath: string[]) {
  return keyStrPath.map(str => strSymbolDict[str] || str);
}

export function pushKeyPath(meta: DraftMeta, keyPath: string[], inputKeyStrPath?: string[]) {
  const { keyPaths, keyStrPaths } = meta;
  const keyStrPath = inputKeyStrPath || toKeyStrPath(keyPath);
  const idx = getKeyPathIdx(keyStrPaths, keyStrPath);

  if (idx < 0) {
    keyPaths.push(keyPath);
    keyStrPaths.push(keyStrPath);
  }
}

/**
 * 删一条路径，并将 keyPath, keyStrPath 重新指向一个存在的路径
 */
export function delKeyPath(meta: DraftMeta) {
  const { keyPaths, keyStrPaths, keyStrPath } = meta;
  const idx = getKeyPathIdx(keyStrPaths, keyStrPath);
  keyStrPaths.splice(idx, 1);
  keyPaths.splice(idx, 1);
  meta.keyPath = keyPaths[0];
  meta.keyStrPath = keyStrPaths[0];
}

/**
 * string 获取不到，尝试转为 number 获取
 */
export function getMapVal(map: Map<any, any>, key: string) {
  const strKeyVal = map.get(key);
  if (strKeyVal !== undefined) {
    return strKeyVal;
  }
  const numKeyVal = map.get(Number(key) || key);
  if (numKeyVal !== undefined) {
    return numKeyVal;
  }
  return undefined;
}

export function getVal(obj: any, keyPath: string[]) {
  let val: any;
  let parent = obj;
  const lastIdx = keyPath.length - 1;
  let isGetted = true;

  for (let i = 0; i <= lastIdx; i++) {
    const key = keyPath[i];
    if (!parent && i < lastIdx) {
      isGetted = false;
      break;
    }
    val = isMap(parent) ? getMapVal(parent, key) : parent[key];
    parent = val;
  }

  return { val, isGetted };
}

export function getValByKeyPaths(obj: any, keyPaths: string[][]) {
  let targetVal: any
  let isValGetted = false;

  const lastIdx = keyPaths.length - 1;
  for (let i = 0; i <= lastIdx; i++) {
    const keyPath = keyPaths[i];
    const { isGetted, val } = getVal(obj, keyPath);
    if (isGetted) {
      targetVal = val;
      isValGetted = true;
      break;
    }
  }
  return { isGetted: isValGetted, val: targetVal };
}

export function setVal(obj: any, keyPath: string[], val: any) {
  let parent = obj;
  const lastIdx = keyPath.length - 1;
  for (let i = 0; i <= lastIdx; i++) {
    if (!parent) {
      break;
    }
    const key = keyPath[i];
    if (i === lastIdx) {
      parent[key] = val;
      break;
    }
    parent = isMap(parent) ? getMapVal(parent, key) : parent[key];
  }
}

export function setValByKeyPaths(obj: any, keyPaths: string[][], val: any) {
  const lastIdx = keyPaths.length - 1;
  for (let i = 0; i <= lastIdx; i++) {
    const keyPath = keyPaths[i];
    setVal(obj, keyPath, val);
  }
}

/**
 * in: keyPath [a,b,0,d,0]  [[a,b,0], [info,0]]
 * out: [[a,b,0,d,0], [info,0,d,0]]
 */
export function intersectPath(keyPath: string[], commonKeyPaths: string[][]) {
  const inputKeyStr = getKeyStrByPath(keyPath);
  let restStr = '';
  for (const tmpKeyPath of commonKeyPaths) {
    const tmpKeyStr = getKeyStrByPath(tmpKeyPath, true);
    const prefix = `${tmpKeyStr}|`;
    if (inputKeyStr.startsWith(prefix)) {
      restStr = inputKeyStr.substring(prefix.length);
      break;
    }
  }

  const newKeyPaths: string[][] = [];
  if (restStr) {
    const subStrPaths = restStr.split('|');
    const subPaths = toKeyPath(subStrPaths);
    commonKeyPaths.forEach((keyPath) => {
      newKeyPaths.push(keyPath.concat(subPaths));
    });
  }

  return newKeyPaths;
}
