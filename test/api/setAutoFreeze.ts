import { Limu, setAutoFreeze, produce, createDraft, finishDraft } from '../../src';
setAutoFreeze(false);

describe('check setAutoFreeze', () => {
  test('new Limu', () => {
    const base = { key: 1 };
    const limuApis = new Limu();
    const draft = limuApis.createDraft(base);
    draft.key = 2;
    const final = limuApis.finishDraft(draft);
    expect(final.key === 2).toBeTruthy();
    expect(base.key === 1).toBeTruthy();

    base.key = 100; // base is unfrozen
    expect(base.key).toBe(100);
    expect(final.key === 2).toBeTruthy();
  });

  test('produce', () => {
    const base = { key: 1 };
    const final = produce(base, (draft) => {
      draft.key = 2;
    });
    expect(base.key === 1).toBeTruthy();
    expect(final.key === 2).toBeTruthy();

    base.key = 100; // base is unfrozen
    expect(base.key).toBe(100);
    expect(final.key === 2).toBeTruthy();
  });

  test('produce curry', () => {
    const base = { key: 1 };
    const cb = produce<typeof base>((draft) => {
      draft.key = 2;
    });
    const final = cb(base);
    expect(base.key === 1).toBeTruthy();
    expect(final.key === 2).toBeTruthy();

    base.key = 100; // base is unfrozen
    expect(base.key).toBe(100);
    expect(final.key === 2).toBeTruthy();
  });


  test('createDraft and finishDraft', () => {
    const base = { key: 1 };
    const draft = createDraft(base);
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

});