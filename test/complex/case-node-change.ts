// @ts-nocheck
import { createDraft, finishDraft, isNewArch } from '../_util';

describe('case-node-change', () => {
  test('node-change 1', () => {
    const base = {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: 1,
              },
            },
          },
        },
      },
    };
    const draft = createDraft(base);

    draft.a.b.c = { newKey: { key2: 2 } };
    expect(draft.a.b.c).toMatchObject({ newKey: { key2: 2 } });
    expect(base.a.b.c).toMatchObject({ d: { e: { f: 1 } } });

    draft.a.b.c.newKey.key2 = 888;
    expect(draft.a.b.c.newKey.key2).toBe(888);
    expect(base.a.b.c.newKey).toBe(undefined);

    draft.a2 = 2;
    expect(draft.a2).toBe(2);
    expect(base.a2).toBe(undefined);

    const final = finishDraft(draft);

    expect(base !== final).toBeTruthy();
    expect(base.a.b.c.d.e.f).toBe(1);
    expect(final.a.b.c).toMatchObject({ newKey: { key2: 888 } });
  });

  test('node-change 2', () => {
    const base = {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: 1,
              },
            },
          },
        },
      },
    };
    const draft = createDraft(base);

    const cVal = draft.a.b.c;
    cVal.d = 'oops';
    draft.a1 = cVal;
    delete draft.a.b.c;
    expect(draft.a.b.c).toBe(undefined);
    expect(draft.a1).toMatchObject({ d: 'oops' });
    expect(base.a.b.c).toMatchObject({ d: { e: { f: 1 } } });
    const final = finishDraft(draft);

    expect(final.a.b.c).toBe(undefined);
    expect(final.a1).toMatchObject({ d: 'oops' });
    expect(base.a.b.c).toMatchObject({ d: { e: { f: 1 } } });
  });

  test('node-change 3', () => {
    const base = {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: 1,
              },
            },
          },
        },
      },
    };
    const draft = createDraft(base);

    const cVal = draft.a.b.c;
    draft.a1 = cVal;
    cVal.d = 'oops';
    const final = finishDraft(draft);

    expect(final).toMatchObject({
      a: { b: { c: { d: 'oops' } } },
      a1: { d: 'oops' },
    });
    expect(base).toMatchObject({ a: { b: { c: { d: { e: { f: 1 } } } } } });
  });

  test('delete arr: assign push del push', () => {
    const base = {
      a: {
        b: {
          c: [1, 2, 3],
        },
      },
    };
    const draft = createDraft(base);

    const cVal = draft.a.b.c;
    draft.a1 = cVal;
    cVal.push(4);
    delete draft.a.b.c;
    cVal.push(5);
    const final = finishDraft(draft);

    expect(final).toMatchObject({ a: { b: {} }, a1: [1, 2, 3, 4, 5] });
    expect(base).toMatchObject({ a: { b: { c: [1, 2, 3] } } });
  });

  test('delete arr: del push assign', () => {
    const base = {
      a: {
        b: {
          c: [1, 2, 3],
        },
      },
    };
    const draft = createDraft(base);

    const cVal = draft.a.b.c;
    delete draft.a.b.c;
    cVal.push(4);
    cVal.push(5);
    draft.a1 = cVal;
    const final = finishDraft(draft);

    expect(final).toMatchObject({ a: { b: {} }, a1: [1, 2, 3, 4, 5] });
    expect(base).toMatchObject({ a: { b: { c: [1, 2, 3] } } });
  });

  test('delete arr: push del assign', () => {
    const base = {
      a: {
        b: {
          c: [1, 2, 3],
        },
      },
    };
    const draft = createDraft(base);

    const cVal = draft.a.b.c;
    cVal.push(4);
    cVal.push(5);
    delete draft.a.b.c;
    draft.a1 = cVal;
    const final = finishDraft(draft);

    expect(final).toMatchObject({ a: { b: {} }, a1: [1, 2, 3, 4, 5] });
    expect(base).toMatchObject({ a: { b: { c: [1, 2, 3] } } });
  });

  test('node-change: allowMultiRef', () => {
    if (isNewArch()) {
      return;
    }
    const cVal = {
      d: {
        e: {
          f: 1,
        },
      },
    };
    const base = {
      a: {
        b: {
          c: cVal,
        },
      },
      a1: cVal,
    };

    let draft: any;
    if (isNewArch()) {
      draft = createDraft(base);
    } else {
      draft = createDraft(base, { allowMultiRef: true });
    }
    draft.a1.d = 222;
    const final = finishDraft(draft);

    expect(final).toMatchObject({
      a: { b: { c: { d: 222 } } },
      a1: { d: 222 },
    });
    expect(base).toMatchObject({
      a: { b: { c: { d: { e: { f: 1 } } } } },
      a1: { d: { e: { f: 1 } } },
    });
  });
});
