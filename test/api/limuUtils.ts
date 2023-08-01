// @ts-nocheck
import { createDraft, finishDraft, immut, limuUtils } from '../../src';

const normalShallowCompare = (a, b) => limuUtils.shallowCompare(a, b, false);

describe('check apis', () => {
  test('limuUtils', () => {
    expect(limuUtils).toBeTruthy();
    expect(limuUtils.canBeNum).toBeInstanceOf(Function);
    expect(limuUtils.isFn).toBeInstanceOf(Function);
    expect(limuUtils.isMap).toBeInstanceOf(Function);
    expect(limuUtils.isObject).toBeInstanceOf(Function);
    expect(limuUtils.isPrimitive).toBeInstanceOf(Function);
    expect(limuUtils.isPromiseFn).toBeInstanceOf(Function);
    expect(limuUtils.isPromiseResult).toBeInstanceOf(Function);
    expect(limuUtils.isSet).toBeInstanceOf(Function);
    expect(limuUtils.isSymbol).toBeInstanceOf(Function);
    expect(limuUtils.noop).toBeInstanceOf(Function);
    expect(limuUtils.isDiff).toBeInstanceOf(Function);
    expect(limuUtils.isDraft).toBeInstanceOf(Function);
    expect(limuUtils.getDraftMeta).toBeInstanceOf(Function);
    expect(limuUtils.shallowCompare).toBeInstanceOf(Function);
  });

  test('getDraftMeta', () => {
    const base = { key: 1 };
    const draft = createDraft(base);
    expect(limuUtils.getDraftMeta(draft)).toBeTruthy();
    const final = finishDraft(draft);
    expect(final).toBeTruthy();
  });

  test('isDraft: base', () => {
    const { isDraft } = limuUtils;
    const base = { a: [1, 2, 3] };
    const draft = createDraft(base);
    const im = immut(base);

    expect(isDraft(draft)).toBeTruthy();
    expect(isDraft(im)).toBeFalsy();
    expect(isDraft(base)).toBeFalsy();
    expect(isDraft({ tmp: 'tmp data' })).toBeFalsy();
  });

  test('isDiff: 2 immut', () => {
    const { isDiff } = limuUtils;
    const base = { a: [1, 2, 3] };
    const im1 = immut(base);
    const im2 = immut(base);
    expect(im1.a !== im2.a).toBeTruthy();
    expect(isDiff(im1.a, im2.a)).toBeFalsy();

    const draft = createDraft(base);
    draft.a.push(4);
    finishDraft(draft);
    expect(im1.a !== im2.a).toBeTruthy();
    expect(isDiff(im1.a, im2.a)).toBeFalsy();
  });

  test('isDiff: mutate', () => {
    const { isDiff } = limuUtils;
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
    const { isDiff } = limuUtils;
    const base = { a: [1, 2, 3], b: { b1: 1, b2: 2 } };
    expect(isDiff(immut(base), immut(base))).toBeFalsy();
    expect(isDiff(immut(base, { compareVer: true }), immut(base, { compareVer: true }))).toBeTruthy();
  });

  test('shallowCompare', () => {
    const { shallowCompare } = limuUtils;

    expect(shallowCompare({ a: 1 }, { a: 1 })).toBeTruthy();
    expect(shallowCompare({ a: 1 }, { a: 2 })).toBeFalsy();
  });

  test('shallowCompare: compare sub obj', () => {
    const { shallowCompare } = limuUtils;
    const base = { a: [1, 2, 3], b: { b1: 1, b2: 2, c: { c1: 1, c2: 2 } } };
    const im1 = immut(base);
    const im2 = immut(base);
    const draft1 = createDraft(base);
    draft1.a.push(4);
    finishDraft(draft1);

    expect(shallowCompare(im1.b, im2.b)).toBeTruthy();
    expect(normalShallowCompare(im1.b, im2.b)).toBeFalsy();
  });

  test('shallowCompare: compare arr item', () => {
    const { shallowCompare } = limuUtils;
    const base = { a: [{ n: 1 }, { n: 2 }] };
    const im1 = immut(base);
    const im2 = immut(base);
    const draft1 = createDraft(base);
    draft1.a[0].n = 100;
    finishDraft(draft1);

    const props1 = { item: im1.a[1], no: 1 };
    const props2 = { item: im2.a[1], no: 1 };
    expect(shallowCompare(props1, props2)).toBeTruthy();
    expect(normalShallowCompare(props1, props2)).toBeFalsy();
    expect(im1.a[1] === im2.a[1]).toBeFalsy();

    const draft2 = createDraft(base);
    draft2.a[1].n = 200;
    const next = finishDraft(draft2);

    expect(next.a[1].n === 200).toBeTruthy();
    expect(im1.a[1].n === 2).toBeTruthy(); // still 2
    expect(im2.a[1].n === 2).toBeTruthy();
    const props3 = { item: im1.a[1], no: 1 };
    const props4 = { item: im2.a[1], no: 1 };
    expect(shallowCompare(props3, props4)).toBeTruthy();
    expect(normalShallowCompare(props3, props4)).toBeFalsy();
    expect(im1.a[1] === im2.a[1]).toBeFalsy();

    // assign next to base
    Object.assign(base, next);
    expect(base.a[1].n === 200).toBeTruthy();
    expect(im1.a[1].n === 200).toBeTruthy(); // change to 200
    expect(im2.a[1].n === 200).toBeTruthy();
    const props5 = { item: im1.a[1], no: 1 };
    const props6 = { item: im2.a[1], no: 1 };
    expect(shallowCompare(props5, props6)).toBeTruthy();
    expect(normalShallowCompare(props5, props6)).toBeFalsy();
    expect(im1.a[1] === im2.a[1]).toBeFalsy();
  });
});
