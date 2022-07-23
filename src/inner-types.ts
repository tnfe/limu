/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Tencent Corporation. All rights reserved.
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
type AnyObject = {
  [key: string]: any;
};
type AnyArray = Array<any>;

export type ObjectLike = AnyObject | AnyArray | Map<any, any> | Set<any>;

export interface DraftMeta<T extends ObjectLike = ObjectLike> {
  rootMeta: DraftMeta,
  parentMeta: null | DraftMeta,
  parent: null | ObjectLike,
  parents: ObjectLike[],
  parentType: string,
  selfType: string,
  self: T,
  copy: T,
  modified: boolean,
  isPartial: boolean,
  isDel?: boolean,
  key: string,
  // idx: number, // 数组元素才需要用到
  keyPath: string[],
  level: number,
  scopes: DraftMeta[],
  proxyVal: null | T,
  proxyItems: null | Map<any, any> | Set<any>,
  finishDraft: (proxyDraft: ObjectLike) => ObjectLike,
  ver: string,
  revoke: any,
}

export interface ICreateDraftOptions {
  /** allow user overwrite global autoFreeze setting in current call process */
  autoFreeze?: boolean;
  /** it does not works currently */
  usePatches?: boolean;
}
