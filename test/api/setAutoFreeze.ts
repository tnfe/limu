import { produce, createDraft, finishDraft, getAutoFreeze, setAutoFreeze } from '../../src';
import '../_util';

describe('set autoFreeze', () => {
  test('get set', () => {
    setAutoFreeze(true);
    expect(getAutoFreeze()).toBe(true);
  });

  test('produce', () => {
    const base = { key: 1 };
    const final = produce(base, (draft) => {
      draft.key = 2;
    }, { autoFreeze: true });
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
    }, { autoFreeze: true });
    const final = cb(base);
    expect(base.key === 1).toBeTruthy();
    expect(final.key === 2).toBeTruthy();

    base.key = 100; // base is unfrozen
    expect(base.key).toBe(100);
    expect(final.key === 2).toBeTruthy();
  });


  test('createDraft and finishDraft', () => {
    const base = { key: 1 };
    const draft = createDraft(base, { autoFreeze: true });
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
