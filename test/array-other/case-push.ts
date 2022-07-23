import { createDraft, finishDraft } from '../_util';

describe('case push', () => {
  test('push', () => {

    var base = { a: { b: { c: 1 } }, b: null, c: [1, 2, 3] };
    // @ts-ignore
    base.b = base.a.b;
    // @ts-ignore
    base.b.c = 888;

    var draft = createDraft(base);
    // @ts-ignore
    draft.b.c = 999;
    const final = finishDraft(draft);
    // @ts-ignore
    expect(final.b.c).toBe(999);

    var draft2 = createDraft(base);
    // @ts-ignore
    draft2.b.c = 1000;
    // @ts-ignore
    delete draft2.b.e;
    draft2.c.push(1000);
    draft2.c.pop();
    const final2 = finishDraft(draft2);
    // @ts-ignore
    expect(final2.b.c).toBe(1000);
  });

})
