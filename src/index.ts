/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Tencent Corporation. All rights reserved.
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { ObjectLike, ICreateDraftOptions } from './inner-types';
import { buildLimuApis } from './core/build-limu-apis';
import { isDraft as isDraftFn, getDraftMeta as getDraftMetaFn } from './core/meta';
import { deepFreeze as deepFreezeFn } from './core/freeze';
import { deepCopy as deepCopyFn } from './core/copy';
import { original as originalFn, current as currentFn } from './core/user-util';
import { limuConfig } from './support/inner-data';
import { isPromiseFn, isPromiseResult } from './support/util';
import { LIMU_MAJOR_VER } from './support/ver';

type BuLimu = ReturnType<typeof buildLimuApis>;

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


export class Limu {
  public createDraft: CreateDraft;

  public finishDraft: FinishDraft;

  constructor() {
    const limuApis = buildLimuApis();
    this.createDraft = limuApis.createDraft;
    // @ts-ignore
    this.finishDraft = limuApis.finishDraft;
  }
}


export function createDraft<T extends ObjectLike>(base: T, options?: ICreateDraftOptions): Draft<T> {
  const apis = new Limu();
  // @ts-ignore , add [as] just for click to see implement
  return apis.createDraft(base, options) as BuLimu['createDraft'];
}


export function finishDraft<T extends ObjectLike>(draft: Draft<T>): T {
  const draftMeta = getDraftMetaFn(draft);
  let finishHandler: (FinishDraft | null) = null;
  if (draftMeta) {
    // @ts-ignore , add [as] just for click to see implement
    finishHandler = draftMeta.finishDraft as BuLimu['finishDraft'];
  }
  if (!finishHandler) {
    throw new Error(`oops, not a Limu draft!`);
  }
  return finishHandler(draft);
}


function checkCbFn(cb) {
  if (typeof cb !== 'function') {
    throw new Error('produce callback is not a function');
  }
}


// see issue https://github.com/tnfe/limu/issues/5
function checkCbPromise(cb, result: any) {
  if (isPromiseFn(cb) || isPromiseResult(result)) {
    throw new Error('produce callback can not be a promise function');
  }
}


function innerProduce(baseState, cb, options?: ICreateDraftOptions) {
  checkCbFn(cb);
  const draft = createDraft(baseState, options);
  const result = cb(draft);
  checkCbPromise(cb, result)
  return finishDraft(draft);
}


function produceFn(baseState: any, cb: any, options?: ICreateDraftOptions) {
  if (!cb || typeof cb !== 'function') {
    // expect baseState to be a callback, support curried invocation
    // expect cb to be options
    const mayCb = baseState;
    const mayOptions = cb;
    checkCbFn(baseState);
    return (state) => {
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
