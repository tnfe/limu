// @ts-nocheck
import { createDraft, finishDraft } from '../_util';

describe('case-node-change', () => {
  test('node-change 1', () => {
    const base = {
      a: { b: { c: 1 } },
      b: null,
      c: [1, 2, 3],
      d: { d1: { d2: { d3: { d4: { d5: { d6: 1 } } } } } },
      e: [{ e1: { e2: 222 } }]
    }
    const draft = createDraft(base);
    draft.a.b.c = { newKey: { key2: 2 } };
    expect(draft.a.b.c.newKey.key2).toBe(2);
    draft.a.b.c.newKey.key2 = 888;
    expect(draft.a.b.c.newKey.key2).toBe(888);

    const e2 = base.e[0].e1.e2;
    expect(e2).toBe(222);
    base.e[0].e1.e2 = 888;

    draft.a2 = 2;
    expect(draft.a2).toBe(2);
    expect(base.a2).toBe(undefined);

    draft.b = { b1: 'hi b' };
    const final = finishDraft(draft);

    expect(base !== final).toBeTruthy();
    expect(base.b).toBe(null);
    expect(final.b).toMatchObject({ b1: 'hi b' });
    expect(final.a.b.c).toMatchObject({ newKey: { key2: 888 } });

  })
});
