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
      f: 1,
      g: 's',
      h: true,
    };
    const draft = createDraft(base);
    expect(isDraft(draft.b)).toBeFalsy();
    expect(isDraft(draft.f)).toBeFalsy();
    expect(isDraft(draft.g)).toBeFalsy();
    expect(isDraft(draft.g)).toBeFalsy();

    draft.b = Array.from(Array(10000).keys());
    draft.f = { data: 'obj' };
    draft.g = [];
    draft.h = new Map();

    expect(isDraft(draft.b)).toBeTruthy();
    expect(isDraft(draft.f)).toBeTruthy();
    expect(isDraft(draft.g)).toBeTruthy();
    expect(isDraft(draft.h)).toBeTruthy();

    draft.f = undefined;
    draft.g = 1;
    draft.h = true;

    expect(isDraft(draft.f)).toBeFalsy();
    expect(isDraft(draft.g)).toBeFalsy();
    expect(isDraft(draft.h)).toBeFalsy();

    const final = finishDraft(draft);
    expect(base !== final).toBeTruthy();
    expect(final.b.length === 10000).toBeTruthy();
    expect(base.b === null).toBeTruthy();
  });
});
