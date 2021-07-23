import { Limu, produce, getDraftMeta, createDraft, finishDraft } from '../src';

describe('check apis', () => {
  test('Limu', () => {
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

    const cb = produce((draft: any) => {
      draft.key = 2;
    });
    expect(cb).toBeInstanceOf(Function);
    const final2 = cb(base);
    expect(final2.key === 2).toBeTruthy();

    try {
      // @ts-ignore
      produce(2);
    } catch (e) {
      expect(e.message).toMatch(/(?=produce callback is not a function)/);
    }

    try {
      // @ts-ignore
      produce(async () => { });
    } catch (e) {
      expect(e.message).toMatch(/(?=produce callback can not be a promise function)/);
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