/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { buildLimuApis } from './core/build-limu-apis';
import { deepCopy as deepCopyFn } from './core/copy';
import { deepFreeze as deepFreezeFn } from './core/freeze';
import { getDraftMeta as getDraftMetaFn, isDraft as isDraftFn } from './core/meta';
import { current as currentFn, original as originalFn } from './core/user-util';
import type { ICreateDraftOptions, IInnerCreateDraftOptions, ObjectLike, Op } from './inner-types';
import { IMMUT_BASE, LIMU_MAJOR_VER, VER as v } from './support/consts';
import { conf } from './support/inner-data';
import { isFn, isPromiseFn, isPromiseResult } from './support/util';

type LimuApis = ReturnType<typeof buildLimuApis>;

export type { ObjectLike, ICreateDraftOptions, Op };
export type Draft<T> = T;
export type CreateDraft = <T extends ObjectLike>(base: T, options?: ICreateDraftOptions) => Draft<T>;
export type FinishDraft = <T extends ObjectLike>(draft: T) => T;
export type ProduceCb<T> = (draft: Draft<T>) => void;
export type GenNewStateCb<T> = (state: T) => T;
// export type GenNewPatchesCb<T> = (state: T) => any[];
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

export const VER = v;

export function createDraft<T extends ObjectLike = ObjectLike>(base: T, options?: ICreateDraftOptions): Draft<T> {
  const apis = buildLimuApis(options as IInnerCreateDraftOptions);
  // @ts-ignore , add [as] just for click to see implement
  return apis.createDraft(base) as LimuApis['createDraft'];
}

export function finishDraft<T extends ObjectLike = ObjectLike>(draft: Draft<T>): T {
  const draftMeta = getDraftMetaFn(draft);
  let finishHandler: FinishDraft | null = null;
  if (draftMeta) {
    // @ts-ignore , add [as] just for click to see implement
    finishHandler = draftMeta.finishDraft as LimuApis['finishDraft'];
  }
  if (!finishHandler) {
    throw new Error(`oops, not a Limu draft!`);
  }
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

export const getDraftMeta = getDraftMetaFn;

export const isDraft = isDraftFn;

export const produce = produceFn as unknown as IProduce;

// to be implemented in the future
// export const produceWithPatches = producePatchesFn as unknown as IProduceWithPatches;

export const deepFreeze = deepFreezeFn;

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

export function setAutoFreeze(autoFreeze: boolean) {
  conf.autoFreeze = autoFreeze;
}

export function getAutoFreeze() {
  return conf.autoFreeze;
}

export function getMajorVer() {
  return LIMU_MAJOR_VER;
}

export const original = originalFn;

export const current = currentFn;

export default produce;
