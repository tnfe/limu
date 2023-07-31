// @ts-nocheck
import { innerUtil, immut, createDraft, finishDraft } from '../../src';

describe('check apis', () => {
  test('innerUtil', () => {
    expect(innerUtil).toBeTruthy();
    expect(innerUtil.canBeNum).toBeInstanceOf(Function);
    expect(innerUtil.isFn).toBeInstanceOf(Function);
    expect(innerUtil.isMap).toBeInstanceOf(Function);
    expect(innerUtil.isObject).toBeInstanceOf(Function);
    expect(innerUtil.isPrimitive).toBeInstanceOf(Function);
    expect(innerUtil.isPromiseFn).toBeInstanceOf(Function);
    expect(innerUtil.isPromiseResult).toBeInstanceOf(Function);
    expect(innerUtil.isSet).toBeInstanceOf(Function);
    expect(innerUtil.isSymbol).toBeInstanceOf(Function);
    expect(innerUtil.noop).toBeInstanceOf(Function);
    expect(innerUtil.isDiff).toBeInstanceOf(Function);
    expect(innerUtil.isDraft).toBeInstanceOf(Function);
    expect(innerUtil.getDraftMeta).toBeInstanceOf(Function);
    expect(innerUtil.shallowCompare).toBeInstanceOf(Function);
  });

  test('getDraftMeta', () => {
    const base = { key: 1 };
    const draft = createDraft(base);
    expect(innerUtil.getDraftMeta(draft)).toBeTruthy();
    const final = finishDraft(draft);
    expect(final).toBeTruthy();
  });

  test('isDraft', () => {
    const { isDraft } = innerUtil;
    const base = { a: [1, 2, 3] };
    const draft = createDraft(base);
    const im = immut(base);

    expect(isDraft(draft)).toBeTruthy();
    expect(isDraft(im)).toBeFalsy();
    expect(isDraft(base)).toBeFalsy();
    expect(isDraft({ tmp: 'tmp data' })).toBeFalsy();
  });

  test('isDiff', () => {
    const { isDiff } = innerUtil;
    expect(isDiff(1, 2)).toBeTruthy();
    expect(isDiff({ a: 1 }, { a: 1 })).toBeTruthy();

    const base = { a: [1, 2, 3], b: { b1: 1, b2: 2 } };
    const draft = createDraft(base);
    const im = immut(base);
    expect(isDiff(draft, base)).toBeFalsy();
    expect(isDiff(im, base)).toBeFalsy();
    expect(isDiff(draft.a, base.a)).toBeFalsy();
    expect(isDiff(im.a, base.a)).toBeFalsy();

    draft.a.push(4);
    expect(isDiff(draft, im)).toBeTruthy();
    expect(isDiff(draft, base)).toBeTruthy();
    expect(isDiff(draft.a, im.a)).toBeTruthy();
    expect(isDiff(draft.a, base.a)).toBeTruthy();
    // b still ref the same object
    expect(isDiff(draft.b, im.b)).toBeFalsy();
    expect(isDiff(draft.b, base.b)).toBeFalsy();

    const next = finishDraft(draft);
    // base and im are always the same
    expect(isDiff(base.a, im.a)).toBeFalsy();
    expect(isDiff(base, im)).toBeFalsy();

    expect(isDiff(base, next)).toBeTruthy();
    expect(isDiff(im, next)).toBeTruthy();
    expect(isDiff(base.a, next.a)).toBeTruthy();
    expect(isDiff(im.a, next.a)).toBeTruthy();
    // b still ref the same object
    expect(isDiff(base.b, next.b)).toBeFalsy();
    expect(isDiff(im.b, next.b)).toBeFalsy();
  });


  test('isDiff: compareVer', () => {
    const { isDiff } = innerUtil;
    const base = { a: [1, 2, 3], b: { b1: 1, b2: 2 } };
    expect(isDiff(immut(base), immut(base))).toBeFalsy();
    expect(isDiff(immut(base, { compareVer: true }), immut(base, { compareVer: true }))).toBeTruthy();
  });

  test('shallowCompare', () => {
    const { shallowCompare } = innerUtil;

    expect(shallowCompare({ a: 1 }, { a: 1 })).toBeTruthy();
    expect(shallowCompare({ a: 1 }, { a: 2 })).toBeFalsy();
  });
});
