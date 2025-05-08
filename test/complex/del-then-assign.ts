// @ts-nocheck
import { createDraft, finishDraft } from '../_util';

describe('del-then-assign', () => {
  test('case 1', () => {
    const base = { a: 1, b: { test: 2 }, c: { c1: 1 } };
    const draft = createDraft(base);
    const b = draft.b;
    delete draft.b; // del b
    draft.c.c2 = b; // assign b to c.c2
    draft.c.c2.test = 1000; // change test by c.c2.test
    const final = finishDraft(draft);

    expect(base !== final).toBeTruthy();
    expect(base.b.test).toBe(2);
    expect(base.c.c2).toBe(undefined);
    expect(final.b).toBe(undefined);
    expect(final.c.c2.test).toBe(1000);
  });

  test('case 2', () => {
    const base = { a: 1, b: { test: 2 }, c: { c1: 1 } };
    const draft = createDraft(base);
    const b = draft.b;
    delete draft.b; // del b

    b.test = 1000; //  change b.test then assign to c.c2
    draft.c.c2 = b; // assign b to c.c2
    const final = finishDraft(draft);

    expect(base !== final).toBeTruthy();
    expect(base.b.test).toBe(2);
    expect(base.c.c2).toBe(undefined);
    expect(final.b).toBe(undefined);
    expect(final.c.c2.test).toBe(1000);
  });
});
