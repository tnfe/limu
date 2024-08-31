// @ts-nocheck
import { createDraft, finishDraft } from '../../src';
import '../_util';
import type { ICreateDraftOptions } from '../../src';

function changeTest(options: ICreateDraftOptions) {
  const base = { a: 1, b: { test: 2 }, c: { c1: 1 } };
  const draft = createDraft(base, options);
  const b = draft.b;
  delete draft.b;
  draft.c.c2 = b;
  draft.c.c2.test = 1000;
  const final = finishDraft(draft);
  return { final, subDraftNode: b };
}

describe('set autoRevoke when call createDraft', () => {
  test('autoRevoke=false', () => {
    const { final, subDraftNode } = changeTest({ autoRevoke: false });
    // can set b.test new value, but it does not work
    subDraftNode.test = 8888;
    expect(final.c.c2.test).toBe(1000);
  });

  test('autoRevoke=false, silenceSetTrapErr=false', () => {
    const { final, subDraftNode } = changeTest({ autoRevoke: false, silenceSetTrapErr: false });
    // can set b.test new value will throw error
    try {
      subDraftNode.test = 8888;
    } catch (e: any) {
      expect(e.message).toMatch(/(?=trap returned falsish for property)/);
    }
    expect(final.c.c2.test).toBe(1000);
  });

  test('autoRevoke=true', () => {
    const { final, subDraftNode } = changeTest({ autoRevoke: true });
    // can set b.test new value will throw error
    try {
      subDraftNode.test = 8888;
    } catch (e: any) {
      expect(e.message).toMatch(/(?=Cannot perform 'set' on a proxy that has been revoked)/);
    }
    expect(final.c.c2.test).toBe(1000);
  });

  test('read subNode', () => {
    const base = { a: 1, b: { b1: { b2: { test: 1 } }, name: 'b' }, c: { c1: 1 } };
    const draft = createDraft(base, { autoRevoke: false });
    const b = draft.b;
    b.name = 'new_name';
    const final = finishDraft(draft);

    expect(final !== base).toBe(true);
    expect(final.b.name).toBe('new_name');
    expect(base.b.name).toBe('b');
    b.b1.b2.test = 100;
    expect(b.b1.b2.test).toBe(1);
    expect(base.b.b1.b2.test).toBe(1);
    expect(final.b.b1.b2.test).toBe(1);
  });
});
