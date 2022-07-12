import { Limu, produce, getDraftMeta, createDraft, finishDraft } from '../../src';
import { assignFrozenDataInJest } from '../_util';

describe('check apis', () => {
  test('new Limu', () => {
    const limuApis = new Limu();
    expect(limuApis.createDraft).toBeTruthy();
    expect(limuApis.finishDraft).toBeTruthy();

    const base = { key: 1 };
    const draft = limuApis.createDraft(base);
    expect(getDraftMeta(draft)).toBeTruthy();
    const final = limuApis.finishDraft(draft);
    expect(final).toBeTruthy();
  });

  test('produce', () => {
    const base = { key: 1 };
    const final = produce(base, (draft) => {
      draft.key = 2;
    });

    expect(final.key === 2).toBeTruthy();
    assignFrozenDataInJest(() => {
      base.key = 100;
    });

    expect(base.key).toBe(1); // base is frozen
  });

  test('produce curry', () => {
    const base = { key: 1 };
    const cb = produce((draft: any) => {
      draft.key = 2;
    });
    expect(cb).toBeInstanceOf(Function);
    const final2 = cb(base);
    expect(final2.key === 2).toBeTruthy();

    assignFrozenDataInJest(() => {
      base.key = 100;
    });

    expect(base.key).toBe(1); // base is frozen
  });

  test('produce exception', () => {
    try {
      // @ts-ignore
      produce(2);
    } catch (e: any) {
      expect(e.message).toMatch(/(?=produce callback is not a function)/);
    }

    try {
      const curryCb = produce(async () => { });
      curryCb({ tip: 'react base state' });
    } catch (e: any) {
      expect(e.message).toMatch(/(?=produce callback can not be a promise function)/);
    }

    try {
      const curryCb = produce((draft: any) => { draft.a = 1 });
      curryCb(2);
    } catch (e: any) {
      expect(e.message).toMatch(/(?=base state type can only be object\(except null\) or array)/);
    }
  });


  test('wrong finishDraft', () => {
    try {
      finishDraft({ a: 1 });
    } catch (e: any) {
      expect(e.message).toMatch(/(?=oops, not a Limu draft)/);
    }
  });

  test('getDraftMeta', () => {
    const base = { key: 1 };
    const draft = createDraft(base);
    expect(getDraftMeta(draft)).toBeTruthy();
    const final = finishDraft(draft);
    expect(final).toBeTruthy();
  });

});