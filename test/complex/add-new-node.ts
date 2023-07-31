// @ts-nocheck
import { createDraft, finishDraft, isDraft } from '../_util';

describe('add-new-node', () => {
  test('add list', () => {
    const base = {
      a: { b: { c: 1 } },
      b: null,
      c: [1, 2, 3],
      d: { d1: { d2: { d3: { d4: { d5: { d6: 1 } } } } } },
      e: [{ e1: { e2: 222 } }],
    };
    const draft = createDraft(base);
    draft.b = Array.from(Array(10000).keys());
    expect(isDraft(draft.b)).toBeFalsy();
    const final = finishDraft(draft);

    expect(base !== final).toBeTruthy();
    expect(final.b.length === 10000).toBeTruthy();
    expect(base.b === null).toBeTruthy();
  });
});

