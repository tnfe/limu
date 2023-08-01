import { createDraft, finishDraft, getAutoFreeze, produce, setAutoFreeze } from '../../src';
import '../_util';

function readOnlyErr(cb) {
  try {
    cb();
  } catch (err: any) {
    expect(err.message).toMatch(/(?=Cannot assign to read only property)/);
  }
}

describe('set autoFreeze', () => {
  test('get set', () => {
    setAutoFreeze(true);
    expect(getAutoFreeze()).toBe(true);
  });

  test('produce', () => {
    const base = { key: 1 };
    const final = produce(
      base,
      (draft) => {
        draft.key = 2;
      },
      { autoFreeze: true },
    );
    expect(base.key === 1).toBeTruthy();
    expect(final.key === 2).toBeTruthy();

    base.key = 100; // base is unfrozen
    expect(base.key).toBe(100);

    readOnlyErr(() => {
      final.key = 100;
    }); // final is frozen
    expect(final.key === 2).toBeTruthy();
  });

  test('produce deep', () => {
    const base = { a: { b: { c: 1 } } };
    const final = produce(
      base,
      (draft) => {
        draft.a.b.c = 2;
      },
      { autoFreeze: true },
    );
    expect(base.a.b.c === 1).toBeTruthy();
    expect(final.a.b.c === 2).toBeTruthy();

    // @ts-ignore structural mutation
    base.a = 100; // base is unfrozen
    expect(base.a).toBe(100);

    readOnlyErr(() => {
      final.a.b.c = 200;
    }); // final is frozen
    expect(final.a.b.c === 2).toBeTruthy();
  });

  test('produce object list at 2 level', () => {
    const base = {
      data: [
        { id: 1, name: '1' },
        { id: 2, name: '2' },
      ],
    };
    const final = produce(
      base,
      (draft) => {
        draft.data[0].name = '111';
        draft.data.push({ id: 3, name: '3' });
      },
      { autoFreeze: true },
    );
    expect(base.data[0].name === '1').toBeTruthy();
    expect(final.data[0].name === '111').toBeTruthy();
    expect(final.data.length === 3).toBeTruthy();

    readOnlyErr(() => {
      final.data[0].name === '222';
    }); // final is frozen
    readOnlyErr(() => {
      final.data[2].name === '333';
    }); // final is frozen
  });

  test('produce curry', () => {
    const base = { key: 1 };
    const cb = produce<typeof base>(
      (draft) => {
        draft.key = 2;
      },
      { autoFreeze: true },
    );
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
