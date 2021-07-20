import { buildLimuApis } from './core/build-limu-apis';
import * as helper from './core/helper';
import { verKey } from './support/symbols';
import { isPromiseFn } from './support/util';
import { ObjectLike } from './inner-types';

export type Draft<T> = T;
export type CreateDraft = <T extends ObjectLike >(base: T) => Draft<T>;
export type FinishDraft = <T extends ObjectLike >(draft: T) => T;

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
  return apis.createDraft(base);
}

export function finishDraft<T extends ObjectLike>(draft: Draft<T>): T {
  const draftMeta = helper.getMetaForDraft(draft, draft[verKey]);
  let finishHandler: (FinishDraft | null) = null;
  // @ts-ignore
  if (draftMeta) finishHandler = draftMeta.finishDraft;
  if (!finishHandler) {
    throw new Error(`opps, not an Limu draft!`);
  }
  return finishHandler(draft);
}

function checkCb(cb) {
  if (typeof cb !== 'function') {
    throw new Error('produce callback is not a function');
  }
  if (isPromiseFn(cb)) {
    throw new Error('produce callback can not be a promise function');
  }
}

function innerProduce(baseState, cb, check = true) {
  if (check) checkCb(cb);
  const draft = createDraft(baseState);
  cb(draft);
  return finishDraft(draft);
}

type ProduceCb<T> = (draft: Draft<T>) => void;
type GenNewStateCb<T> = (state: T) => T;
interface IProduce {
  <T extends ObjectLike>(baseState: T, cb: ProduceCb<T>): T;
  /**
   * use in react:
   * setState(produce(draft=>{
   *    draft.name = 2;
   * }));
   */
  <T extends ObjectLike>(cb: ProduceCb<T>): GenNewStateCb<T>;
}

const produceFn = (baseState: any, cb: any) => {
  if (!cb) {
    // expect baseState to be a cb
    checkCb(baseState);
    return (state) => {
      return innerProduce(state, baseState, false);
    }
  }
  return innerProduce(baseState, cb) as any;
};

export function getDraftMeta(proxyDraft) {
  const ver = proxyDraft[verKey];
  return helper.getMetaForDraft(proxyDraft, ver) as ObjectLike;
}

export const isDraft = helper.isDraft;

export const produce = produceFn as unknown as IProduce;
