/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
export type AnyObject<T extends any = any> = {
  [key: string]: T;
};
export type AnyArray = Array<any>;
export type NumStrSymbol = number | string | symbol;
export type Key = string | symbol;
export type ObjectLike = AnyObject | AnyArray | Map<any, any> | Set<any>;
export type Op = 'del' | 'set' | 'get';
export type DataType = 'Map' | 'Set' | 'Array' | 'Object';
export type FastModeRange = 'array' | 'all' | 'none';
export interface DraftMeta<T extends AnyObject = AnyObject> {
  rootMeta: DraftMeta;
  parentMeta: null | DraftMeta;
  parent: null | ObjectLike;
  parents: ObjectLike[];
  selfType: DataType;
  self: T;
  copy: T;
  modified: boolean;
  /** 记录数组顺序是否发生变化，辅助数组结构的数据在 clearScopes 阶段决策如何重赋值 */
  isArrOrderChanged: boolean;
  isImmutBase: boolean;
  isDel: boolean;
  isFast: boolean;
  /** 记录某些key对应值是否是一个全新节点 */
  newNodeStats: AnyObject<boolean>;
  key: string;
  keyPath: string[];
  level: number;
  scopes: DraftMeta[];
  proxyVal: T;
  proxyItems: null | Map<any, any> | Set<any>;
  /** scope version */
  ver: string;
  /**
   * record the comparision rule of root proxy state
   */
  compareVer: boolean;
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
   * default: 'array', this param means fastMode effect range,
   * set this param 'all' only if need extremly fast performance,
   * when disable fastMode: LIMU_META stored at obj.copy.__proto__,
   * when enable fastMode: LIMU_META stored at obj.copy with a symbol key,
   * ```text
   * 'none' means disalbe fastMode for all dataNode
   * 'array' means enable fastMode for array items
   * 'all' means enable fastMode for all dataNode
   * ```
   */
  fastModeRange?: FastModeRange;
  /**
   * create a read only draft
   */
  readOnly?: boolean;
  /**
   * default: false, set the comparision rull of root proxy state,
   * the below code explains the function of this parameter
   * ```ts
   * const base = {...};
   * // when compareVer = false, below result will be true
   * isDiff(immut(base), immut(base));
   *
   * // when compareVer = true, below result will be false
   * isDiff(immut(base), immut(base));
   * ```
   * also applicable to `createDraft(base, {readOnly:true})`
   */
  compareVer?: boolean;
  /**
   * defaut: false, there will be no warn tip in the console for changing immut object while set disableWarn true
   */
  disableWarn?: boolean;
  /** default: false */
  debug?: boolean;
  customKeys?: symbol[];
  customGet?: (userCumtomKey: symbol) => any;
}

export interface IInnerCreateDraftOptions extends ICreateDraftOptions {
  [key: symbol]: any;
}

export interface IApiCtx {
  metaMap: Map<any, DraftMeta>;
  /** rootMeta 用此属性记录所有新节点 */
  newNodeMap: Map<any, { parent: any; key: any; node: any; target: any }>;
  debug: boolean;
  metaVer: string;
}

/** key: metaVer, value, apiCtx */
export type RootCtx = Map<string, IApiCtx>;
