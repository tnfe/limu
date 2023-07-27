/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
type AnyObject = {
  [key: string]: any;
};
type AnyArray = Array<any>;

export type Key = string | symbol;
export type ObjectLike = AnyObject | AnyArray | Map<any, any> | Set<any>;
export type Op = 'del' | 'set' | 'get';
export type DataType = 'Map' | 'Set' | 'Array' | 'Object';
export type FastModeRange = 'array' | 'all' | 'none';
export interface DraftMeta<T extends ObjectLike = ObjectLike> {
  rootMeta: DraftMeta;
  parentMeta: null | DraftMeta;
  parent: null | ObjectLike;
  parents: ObjectLike[];
  selfType: DataType;
  self: T;
  copy: T;
  modified: boolean;
  isImmutBase: boolean;
  isPartial: boolean;
  isDel: boolean;
  // TODO: 探索使用linkCount代替isDel，看是否能解决多应用问题
  linkCount: number;
  key: string;
  // idx: number, // 数组元素才需要用到
  keyPath: string[];
  level: number;
  scopes: DraftMeta[];
  proxyVal: T;
  proxyItems: null | Map<any, any> | Set<any>;
  finishDraft: (proxyDraft: ObjectLike) => ObjectLike;
  ver: string;
  revoke: any;
}

export interface IOperateParams {
  parentType: DataType;
  key: string;
  /**
   * key path contains parent node key
   */
  keyPath: string[];
  /**
   * key path contains current node key
   */
  fullKeyPath: string[];
  /**
   * is key comes from built-in fn
   */
  isBuiltInFnKey: boolean;
  /**
   * is current operation a operation that will directly change data node
   */
  isChange: boolean;
  op: Op;
  value: any;
}

export interface ICreateDraftOptions {
  /**
   * default: global.autoFreeze ( false )
   * allow user overwrite global autoFreeze setting in current call process
   */
  autoFreeze?: boolean;
  /** it does't works currently */
  usePatches?: boolean;
  /**
   * any draft operation will trigger this callback
   */
  onOperate?: (params: IOperateParams) => void;
  /**
   * default: 'array', means fastMode effect range
   * set this param 'all' only if need extremly fast performance
   * when disable fastMode: LIMU_META stored at obj.copy.__proto__
   * when enable fastMode: LIMU_META stored at obj.copy with a symbol key
   *
   * 'none' means disalbe fastMode for all dataNode
   * 'array' means enable fastMode for array items
   * 'all' means enable fastMode for all dataNode
   */
  fastModeRange?: FastModeRange;
  readOnly?: boolean;
}

export interface IInnerCreateDraftOptions extends ICreateDraftOptions {
  [key: symbol]: any;
}
