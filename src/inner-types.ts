/*---------------------------------------------------------------------------------------------
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
  selfType: string,
  self: T,
  copy: T,
  modified: boolean,
  isPartial: boolean,
  isDel?: boolean,
  // TODO: 探索使用linkCount代替isDel，看是否能解决多应用问题
  linkCount: number,
  key: string,
  // idx: number, // 数组元素才需要用到
  keyPath: string[],
  level: number,
  scopes: DraftMeta[],
  proxyVal: T,
  proxyItems: null | Map<any, any> | Set<any>,
  finishDraft: (proxyDraft: ObjectLike) => ObjectLike,
  ver: string,
  revoke: any,
}

export type Op = 'del' | 'set' | 'get';

export interface ICreateDraftOptions {
  /**
   * default: global.autoFreeze ( false )
   * allow user overwrite global autoFreeze setting in current call process
   */
  autoFreeze?: boolean;
  /** it does't works currently */
  usePatches?: boolean;
  onRead?: (params: { keyPath: string[], op: Op, value: any }) => {};
  onWrite?: (params: { keyPath: string[], op: Op, value: any }) => {};
  /**
   * default: false
   * set this param true only if need extremly fast performance
   * when false: LIMU_META stored at obj.__proto__
   * when true: LIMU_META stored at obj.self with a symbol key
   */
  fast?: boolean;
}
