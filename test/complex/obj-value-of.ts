import { createDraft, finishDraft } from '../_util';

describe('obj-value-of', () => {
  test('read value-of', () => {
    const base = {
      a: {},
    };
    const draft = createDraft(base);
    base.a.valueOf();
    const final = finishDraft(draft);
    expect(final).toBeTruthy();
  });
});
