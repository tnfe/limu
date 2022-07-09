// @ts-nocheck
import { createDraft, finishDraft } from '../_util';

describe('case-node-change', () => {
  test('node-change 1', () => {
    const base = {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: 1
              }
            }
          }
        }
      }
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

  })
});
