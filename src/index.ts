/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { ObjectLike, ICreateDraftOptions, Op } from './inner-types';
import { buildLimuApis } from './core/build-limu-apis';
import { isDraft as isDraftFn, getDraftMeta as getDraftMetaFn } from './core/meta';
import { deepFreeze as deepFreezeFn } from './core/freeze';
import { deepCopy as deepCopyFn } from './core/copy';
import { original as originalFn, current as currentFn } from './core/user-util';
import { limuConfig } from './support/inner-data';
import { isPromiseFn, isPromiseResult } from './support/util';
import { LIMU_MAJOR_VER, VER as v } from './support/consts';

type LimuApis = ReturnType<typeof buildLimuApis>;

export type { ObjectLike, ICreateDraftOptions, Op };
export type Draft<T> = T;
export type CreateDraft = <T extends ObjectLike >(base: T, options?: ICreateDraftOptions) => Draft<T>;
export type FinishDraft = <T extends ObjectLike >(draft: T) => T;
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

/**
 * 使用 Limu 类创建实例后调用 createDraft finishDraft api（大多数时候，可直接从包里导出 createDraft 调用，不需要用此方式 ）
 * ```
 *  const limuIns = new Limu();
 *  const draft = limuIns.createDraft({ key: 1 });
 *  // change draft ...
 *  limuIns.finishDraft(draft); // 必须用当前 ins 来调用 finishDraft， 使用别的会报错
 * ```
 */
export class Limu {
  public createDraft: CreateDraft;

  public finishDraft: FinishDraft;

  constructor(options?: ICreateDraftOptions) {
    const limuApis = buildLimuApis(options);
    this.createDraft = limuApis.createDraft;
    // @ts-ignore
    this.finishDraft = limuApis.finishDraft;
  }
}


export function createDraft<T extends ObjectLike = ObjectLike>(base: T, options?: ICreateDraftOptions): Draft<T> {
  const apis = new Limu(options);
  // @ts-ignore , add [as] just for click to see implement
  return apis.createDraft(base, options) as LimuApis['createDraft'];
}


export function finishDraft<T extends ObjectLike = ObjectLike>(draft: Draft<T>): T {
  const draftMeta = getDraftMetaFn(draft);
  let finishHandler: (FinishDraft | null) = null;
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
  if (typeof cb !== 'function') {
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
  if (!cb || typeof cb !== 'function') {
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
};


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


export const deepCopy = function <T extends ObjectLike>(obj: T) {
  return deepCopyFn(obj);
}


export function setAutoFreeze(autoFreeze: boolean) {
  limuConfig.autoFreeze = autoFreeze;
}


export function getAutoFreeze() {
  return limuConfig.autoFreeze;
}


export function getMajorVer() {
  return LIMU_MAJOR_VER;
}


export const original = originalFn;


export const current = currentFn;


export default produce;
