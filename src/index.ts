import { buildLimuApis } from './core/build-limu-apis';
import { getMetaForDraft } from './core/helper';
import { verKey } from './support/symbols';
import { isPromiseFn } from './support/util';

type AnyObject = {
  [key: string]: any;
};
type AnyArray = Array<any>;

export type Draft<T> = T;

export type ObjectLike = AnyObject | AnyArray;

export type CreateDraft = <T extends ObjectLike >(base: T) => Draft<T>;
export type FinishDraft = <T extends ObjectLike >(draft: T) => T;

export class Limu {
  public createDraft: CreateDraft;

  public finishDraft: FinishDraft;

  constructor() {
    const limuApis = buildLimuApis();
    this.createDraft = limuApis.createDraft;
    this.finishDraft = limuApis.finishDraft;
  }
}

export function createDraft(base: ObjectLike) {
  const apis = new Limu();
  return apis.createDraft(base);
}

export function finishDraft<T extends ObjectLike>(draft: Draft<T>) {
  const draftMeta = getMetaForDraft(draft, draft[verKey]);
  let finishHandler: (FinishDraft | null) = null;
  if (draftMeta) finishHandler = draftMeta.finishDraft;
  if (!finishHandler) {
    throw new Error(`opps, not an Immut draft!`);
  }
  return finishHandler(draft);
}

function innerProduce(baseState, cb) {
  if (typeof cb !== 'function') {
    throw new Error('produce callback is not a function');
  }
  if (isPromiseFn(cb)) {
    throw new Error('produce callback can not be a  promise function');
  }
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
    return (state) => {
      // now baseState may be cb
      return innerProduce(state, baseState);
    }
  }
  return innerProduce(baseState, cb) as any;
};

export const produce = produceFn as unknown as IProduce;
