/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Tencent Corporation. All rights reserved.
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import { buildLimuApis } from './core/build-limu-apis';
import * as helper from './core/helper';
import { verKey } from './support/symbols';
import { limuConfig } from './support/inner-data';
import { isPromiseFn, isPromiseResult } from './support/util';
import { ObjectLike } from './inner-types';

type BuLimu = ReturnType<typeof buildLimuApis>;

export type Draft<T> = T;
export type CreateDraft = <T extends ObjectLike >(base: T) => Draft<T>;
export type FinishDraft = <T extends ObjectLike >(draft: T) => T;
export type ProduceCb<T> = (draft: Draft<T>) => void;
export type GenNewStateCb<T> = (state: T) => T;
export interface IProduce {
  <T extends ObjectLike>(baseState: T, cb: ProduceCb<T>): T;
  /**
   * use in react:
   * setState(produce(draft=>{
   *    draft.name = 2;
   * }));
   */
  <T extends ObjectLike>(cb: ProduceCb<T>): GenNewStateCb<T>;
}


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


export function createDraft<T extends ObjectLike>(base: T): Draft<T> {
  const apis = new Limu();
  // @ts-ignore , add as just for click to see implement
  return apis.createDraft(base) as BuLimu['createDraft'];
}


export function finishDraft<T extends ObjectLike>(draft: Draft<T>): T {
  const draftMeta = helper.getMetaForDraft(draft, draft[verKey]);
  let finishHandler: (FinishDraft | null) = null;
  if (draftMeta) {
    // @ts-ignore , add as just for click to see implement
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


function innerProduce(baseState, cb) {
  checkCbFn(cb);
  const draft = createDraft(baseState);
  const result = cb(draft);
  checkCbPromise(cb, result)
  return finishDraft(draft);
}


const produceFn = (baseState: any, cb: any) => {
  if (!cb) {
    // expect baseState to be a callback, support curried invocation
    checkCbFn(baseState);
    return (state) => {
      return innerProduce(state, baseState);
    };
  }
  return innerProduce(baseState, cb) as any;
};


export function getDraftMeta(proxyDraft) {
  const ver = proxyDraft[verKey];
  return helper.getMetaForDraft(proxyDraft, ver) as ObjectLike;
}


export const isDraft = helper.isDraft;


export const produce = produceFn as unknown as IProduce;


export function setAutoFreeze(autoFreeze: boolean) {
  limuConfig.autoFreeze = autoFreeze;
}
