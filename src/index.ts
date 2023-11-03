/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { buildLimuApis, FNIISH_HANDLER_MAP } from './core/build-limu-apis';
import { deepCopy as deepCopyFn } from './core/copy';
import { deepFreeze as deepFreezeFn } from './core/freeze';
import { current as currentFn, original as originalFn } from './core/user-util';
import type { ICreateDraftOptions, IInnerCreateDraftOptions, IOperateParams, ObjectLike, Op } from './inner-types';
import { IMMUT_BASE, VER as v } from './support/consts';
import { conf } from './support/inner-data';
import { canBeNum, isFn, isMap, isObject, isPrimitive, isPromiseFn, isPromiseResult, isSet, isSymbol, noop } from './support/util';
import { getDraftMeta, isDiff as isDiffFn, isDraft as isDraftFn, shallowCompare as shallowCompareFn } from './core/meta';
// 避免降到测试覆盖率
// export { getDraftMeta, isDraft, isDiff, shallowCompare };
export type { ICreateDraftOptions, IOperateParams, ObjectLike, Op };

// isDraft isDiff shallowCompare 高频使用的从顶层暴露，其他随 limuUtils 里暴露

/**
 * 判断是否是草稿
 * @see https://tnfe.github.io/limu/docs/api/basic/limu-utils#isdraft
 */
export const isDraft = isDraftFn;
/**
 * 判断两个值是否相同
 * @see https://tnfe.github.io/limu/docs/api/basic/limu-utils#isdiff
 */
export const isDiff = isDiffFn;
/**
 * 浅比较两个对象是否相同
 * @see https://tnfe.github.io/limu/docs/api/basic/limu-utils#shallowcompare
 */
export const shallowCompare = shallowCompareFn;

/**
 * 内部工具函数集合，写为如下格式会降低覆盖率，故导入后再导出
 * ```txt
 * import * as limuUtils; from './support/util';
 * const { isFn, isPromiseFn, isPromiseResult } = limuUtils;;
 * export { limuUtils; };
 * ```
 */
export const limuUtils = {
  noop,
  isObject,
  isMap,
  isSet,
  isFn,
  isPrimitive,
  isPromiseFn,
  isPromiseResult,
  isSymbol,
  canBeNum,
  isDraft,
  isDiff,
  shallowCompare,
  getDraftMeta,
};
export type LimuUtils = typeof limuUtils;

type LimuApis = ReturnType<typeof buildLimuApis>;
export type Draft<T> = T;
export type CreateDraft = <T extends ObjectLike>(base: T, options?: ICreateDraftOptions) => Draft<T>;
export type FinishDraft = <T extends ObjectLike>(draft: T) => T;
export type ProduceCb<T> = (draft: Draft<T>) => void;
export type GenNewStateCb<T> = (state: T) => T;
// export type GenNewPatchesCb<T> = (state: T) => any[];

/**
 * 同步完成生成草稿、修改草稿、结束草稿3个步骤的函数
 */
export interface IProduce {
  <T extends ObjectLike>(baseState: T, recipe: ProduceCb<T>, options?: ICreateDraftOptions): T;
  /**
   * use in react:
   * setState(produce(draft=>{
   *    draft.name = 2;
   * }));
   */
  <T extends ObjectLike>(recipe: ProduceCb<T>, options?: ICreateDraftOptions): GenNewStateCb<T>;
}

// export interface IProduceWithPatches {
//   <T extends ObjectLike>(baseState: T, cb: ProduceCb<T>, options?: ICreateDraftOptions): any[];
// }

/** limu 的版本号 */
export const VER = v;

/**
 * 创建草稿函数，可对返回的草稿对象直接修改，此修改不会影响原始对象
 * @see https://tnfe.github.io/limu/docs/api/basic/create-draft
 */
export function createDraft<T extends ObjectLike = ObjectLike>(base: T, options?: ICreateDraftOptions): Draft<T> {
  const apis = buildLimuApis(options as IInnerCreateDraftOptions);
  // @ts-ignore add [as] just for click to see implement
  return apis.createDraft(base) as LimuApis['createDraft'];
}

/**
 * 结束草稿的函数，生成的新对象和原始对象会结构共享
 * @see https://tnfe.github.io/limu/docs/api/basic/create-draft
 */
export function finishDraft<T extends ObjectLike = ObjectLike>(draft: Draft<T>): T {
  const finishHandler: LimuApis['finishDraft'] = FNIISH_HANDLER_MAP.get(draft);
  if (!finishHandler) {
    throw new Error(`Not a Limu root draft or draft has been finished!`);
  }
  FNIISH_HANDLER_MAP.delete(draft);
  return finishHandler(draft);
}

function checkCbFn(cb: any) {
  if (!isFn(cb)) {
    throw new Error('produce callback is not a function');
  }
}

// see issue https://github.com/tnfe/limu/issues/5
function checkCbPromise(cb: any, result: any) {
  if (isPromiseFn(cb) || isPromiseResult(result)) {
    throw new Error('produce callback can not be a promise function or result');
  }
}

function innerProduce(baseState: any, cb: any, options?: ICreateDraftOptions) {
  checkCbFn(cb);
  const draft = createDraft(baseState, options);
  const result = cb(draft);
  checkCbPromise(cb, result);
  return finishDraft(draft);
}

function produceFn(baseState: any, cb: any, options?: ICreateDraftOptions) {
  if (!cb || !isFn(cb)) {
    // expect baseState to be a callback, support curried invocation
    // expect cb to be options
    const mayCb = baseState;
    const mayOptions = cb;
    checkCbFn(baseState);
    return (state: any) => {
      return innerProduce(state, mayCb, mayOptions);
    };
  }
  return innerProduce(baseState, cb, options) as any;
}

// function producePatchesFn(baseState: any, cb: any, options?: ICreateDraftOptions) {
//   const copyOpts: ICreateDraftOptions = { ... (options || {}), usePatches: true };
//   return produceFn(baseState, cb, copyOpts);
// };

export const produce = produceFn as unknown as IProduce;

// to be implemented in the future
// export const produceWithPatches = producePatchesFn as unknown as IProduceWithPatches;

/**
 * 深冻结传入的值，返回的是冻结后的新值，如传入原始值则不做任何操作，原样返回
 */
export const deepFreeze = deepFreezeFn;

/**
 * 对传入值做深克隆，返回的是克隆后的新值，如传入原始值则不做任何操作，原样返回
 */
export function deepCopy<T extends ObjectLike>(obj: T) {
  return deepCopyFn(obj);
}

/**
 * 生成一个不可修改的对象im，但原始对象的修改将同步会影响到im
 * immut 采用了读时浅代理的机制，相比deepFreeze会拥有更好性能，适用于不暴露原始对象出去，只暴露生成的不可变对象出去的场景
 * @see: https://tnfe.github.io/limu/docs/api/basic/immut
 */
export function immut<T extends ObjectLike>(base: T, options?: Omit<ICreateDraftOptions, 'readOnly'>): T {
  const limuApis = buildLimuApis({ ...(options || {}), readOnly: true, [IMMUT_BASE]: true });
  const immutData = limuApis.createDraft(base);
  return immutData;
}

/**
 * 设置全局冻结配置，可在 createDraft, produce 时二次覆盖此全局配置
 */
export function setAutoFreeze(autoFreeze: boolean) {
  conf.autoFreeze = autoFreeze;
}

/**
 * 获取全局设置的 autoFreeze 值
 */
export function getAutoFreeze() {
  return conf.autoFreeze;
}

/**
 * 查看草稿对应的原始值
 */
export const original = originalFn;

/**
 * 导出草稿的副本数据（ 即深克隆当前草稿 ）
 */
export const current = currentFn;

// disable [export default], let esModuleInterop=true, allowSyntheticDefaultImports=true works in tsconfig.json
// export default produce;
