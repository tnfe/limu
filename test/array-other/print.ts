// @ts-nocheck
import { createDraft, finishDraft, isNewArch, logStr, strfy } from '../_util';

describe('arr print', () => {
  test('pass', () => {
    expect(1).toBe(1);
  });

  test('JSON.stringify 1', () => {
    const base = { a: { b: { c: 1 } }, b: null, c: [1, 2, 3] };
    // @ts-ignore
    base.b = base.a.b;
    // @ts-ignore
    base.b.c = 888;

    const draft = createDraft(base);
    // @ts-ignore
    draft.b.c = 999;
    expect(strfy(draft)).toBe('{"a":{"b":{"c":999}},"b":{"c":999},"c":[1,2,3]}');
    const final = finishDraft(draft);
    expect(strfy(base)).toBe('{"a":{"b":{"c":888}},"b":{"c":888},"c":[1,2,3]}');
    expect(strfy(final)).toBe('{"a":{"b":{"c":999}},"b":{"c":999},"c":[1,2,3]}');
  });

  test('JSON.stringify 2', () => {
    const base = { a: { b: { c: 1, e: 'to del' } }, b: null, c: [1, 2, 3] };
    // @ts-ignore
    base.b = base.a.b;
    // @ts-ignore
    base.b.c = 888;

    const draft = createDraft(base);
    // @ts-ignore
    draft.b.c = 1000;
    logStr(draft);
    expect(strfy(draft)).toBe('{"a":{"b":{"c":1000,"e":"to del"}},"b":{"c":1000,"e":"to del"},"c":[1,2,3]}');
    expect(draft.b === draft.a.b).toBe(true);

    // @ts-ignore
    delete draft.b.e;
    expect(strfy(draft)).toBe('{"a":{"b":{"c":1000}},"b":{"c":1000},"c":[1,2,3]}');
    draft.c.push(1000, 2000);
    expect(strfy(draft)).toBe('{"a":{"b":{"c":1000}},"b":{"c":1000},"c":[1,2,3,1000,2000]}');
    draft.c.pop();
    expect(strfy(draft)).toBe('{"a":{"b":{"c":1000}},"b":{"c":1000},"c":[1,2,3,1000]}');
    const final = finishDraft(draft);
    // @ts-ignore
    expect(final.b.c).toBe(1000);
    expect(final.a.b.c).toBe(1000);
    // @ts-ignore
    expect(base.b.c).toBe(888);
    expect(strfy(base)).toBe('{"a":{"b":{"c":888,"e":"to del"}},"b":{"c":888,"e":"to del"},"c":[1,2,3]}');
  });
});
