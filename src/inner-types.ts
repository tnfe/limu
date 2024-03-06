/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
export type AnyObject<T extends any = any> = {
  [key: string]: T;
};
export type Fn = (...args: any[]) => any;
export type Primitive = boolean | number | string | symbol | null | undefined | BigInt;
export type AnyArray = Array<any>;
export type NumStrSymbol = number | string | symbol;
export type Key = string | symbol;
export type ObjectLike = AnyObject | AnyArray | Map<any, any> | Set<any>;
export type Op = 'del' | 'set' | 'get';
export type DataType = 'Map' | 'Set' | 'Array' | 'Object';
export type FastModeRange = 'array' | 'all' | 'none';

export interface IExecOnOptions {
  parentMeta: DraftMeta | null;
  value: any;
  isChanged?: boolean;
  isCustom?: boolean;
  mayProxyVal?: any;
}

export interface DraftMeta<T = AnyObject> {
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
  hasOnOperate: boolean;
  execOnOperate: (op: Op, key: string, options: IExecOnOptions) => any;
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
  /** 操作记录是否来自于 immut 创建的对象 */
  immutBase: boolean;
  /** 如果时根节点，父亲为 undefined */
  parent?: any;
  /** 如果时根节点，父亲代理为 undefined */
  parentProxy?: any;
  /** 父亲节点的类型，零长字符串表示无父亲节点 */
  parentType: DataType | '';
  /** key 可能为 symbol，请谨慎处理 */
  key: any;
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
   * is data node changed by current operation
   */
  isChanged: boolean;
  /**
   * is key come from customKeys or not
   */
  isCustom: boolean;
  op: Op;
  /** raw value */
  value: any;
  /** proxy value */
  proxyValue: any;
  /**
   * when get op triggered, user can pass a new value to replace the inner returned value,
   * this is a dangerous behavior, the caller is responsible for the consequences
   */
  replaceValue: (newValue: any) => void;
  /**
   * get replaced info
   */
  getReplaced: <T = any>() => { isReplaced: boolean; replacedValue: T };
}

export interface ICreateDraftOptions {
  /**
   * default: global.autoFreeze ( false )
   * allow user overwrite global autoFreeze setting in current call process
   */
  autoFreeze?: boolean;
  /**
   * any draft operation will trigger this callback
   */
  onOperate?: (params: IOperateParams) => any;
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
   * default: false, set the comparision rule of root proxy state,
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
  customKeys?: NumStrSymbol[];
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
