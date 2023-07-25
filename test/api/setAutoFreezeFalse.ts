// @ts-nocheck
import { Limu, produce, createDraft, finishDraft } from '../../src';
import * as util from '../_util';

describe('set autoFreeze false', () => {
  test('produce', () => {
    const base = { key: 1 };
    const final = produce(base, (draft) => {
      draft.key = 2;
    }, { autoFreeze: false });
    expect(base.key === 1).toBeTruthy();
    expect(final.key === 2).toBeTruthy();

    base.key = 100; // base is unfrozen
    expect(base.key).toBe(100);
    expect(final.key === 2).toBeTruthy();
  });

  test('produce curry', () => {
    const base = { key: 1 };
    const cb = produce < typeof base > ((draft) => {
      draft.key = 2;
    }, { autoFreeze: false });
    const final = cb(base);
    expect(base.key === 1).toBeTruthy();
    expect(final.key === 2).toBeTruthy();

    base.key = 100; // base is unfrozen
    expect(base.key).toBe(100);
    expect(final.key === 2).toBeTruthy();
  });


  test('createDraft and finishDraft', () => {
    const base = { key: 1 };
    const draft = createDraft(base, { autoFreeze: false });
    draft.key = 2;
    expect(draft.key === 2).toBeTruthy();
    expect(base.key === 1).toBeTruthy();
    const final = finishDraft(draft);

    expect(base.key === 1).toBeTruthy();
    expect(final.key === 2).toBeTruthy();

    base.key = 100; // base is unfrozen
    expect(base.key).toBe(100);
    expect(final.key === 2).toBeTruthy();
  });


  test('createDraft by frozenData', () => {
    const base = { key: 1 };
    const draft = createDraft(base, { autoFreeze: true });
    draft.key = 2;
    expect(draft.key === 2).toBeTruthy();
    expect(base.key === 1).toBeTruthy();
    const final = finishDraft(draft);


    util.assignFrozenDataInJest(()=>{
      final.key = 10;
    });
    expect(final.key === 10).toBeFalsy();

    const draft2 = createDraft(final, { autoFreeze: true });
    draft2.key = 3;
    expect(draft2.key === 3).toBeTruthy();
    expect(final.key === 2).toBeTruthy();
    const final2 = finishDraft(draft2);
    expect(final2.key === 3).toBeTruthy();
  });
});
