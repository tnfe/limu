import { createDraft, finishDraft } from '../_util';

describe('delete', () => {
  test('case1', () => {
    const base = { a: { b: { c: 1 } }, b: null, c: [1, 2, 3] };
    var draft2 = createDraft(base);
    draft2.a.b.c = 1000;
    // @ts-ignore
    delete draft2.b;
    draft2.c.push(1000);
    draft2.c.pop();
    const final2 = finishDraft(draft2);

    expect(base.b === null).toBeTruthy();
    expect(final2.b === undefined).toBeTruthy();
  });
});
