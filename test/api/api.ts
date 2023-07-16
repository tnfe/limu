import {
  Limu, produce, getDraftMeta, createDraft, finishDraft,
  deepFreeze, getAutoFreeze, original, current, getMajorVer,
} from '../../src';
import { assignFrozenDataInJest, strfy } from '../_util';

describe('check apis', () => {
  test('getMajorVer', () => {
    expect(getMajorVer).toBeTruthy();
    expect(typeof getMajorVer() === 'number').toBeTruthy();
  });

  test('new Limu', () => {
    const limuApis = new Limu();
    expect(limuApis.createDraft).toBeTruthy();
    expect(limuApis.finishDraft).toBeTruthy();

    const base = { key: 1 };
    const draft = limuApis.createDraft(base);
    expect(getDraftMeta(draft)).toBeTruthy();
    const final = limuApis.finishDraft(draft);
    expect(final).toBeTruthy();
    console.log('getAutoFreeze ', getAutoFreeze());
  });

  test('produce', () => {
    const base = { key: 1 };
    const final = produce(base, (draft) => {
      draft.key = 2;
    });

    expect(final.key === 2).toBeTruthy();

    base.key = 100;
    expect(base.key).toBe(100); // base is unfrozen
    console.log('getAutoFreeze ', getAutoFreeze());
  });

  test('produce curry', () => {
    const base = { key: 1 };
    const cb = produce((draft: any) => {
      draft.key = 2;
    });
    expect(cb).toBeInstanceOf(Function);
    const final2 = cb(base);
    expect(final2.key === 2).toBeTruthy();

    assignFrozenDataInJest(() => {
      base.key = 100;
    });

    expect(base.key).toBe(100); // base is unfrozen
  });

  test('produce exception', () => {
    try {
      // @ts-ignore
      produce(2);
    } catch (e: any) {
      expect(e.message).toMatch(/(?=produce callback is not a function)/);
    }

    try {
      // @ts-ignore
      produce(Promise.resolve(2));
    } catch (e: any) {
      expect(e.message).toMatch(/(?=produce callback is not a function)/);
    }

    try {
      const curryCb = produce(async () => { });
      curryCb({ tip: 'react base state' });
    } catch (e: any) {
      expect(e.message).toMatch(/(?=produce callback can not be a promise function or result)/);
    }

    try {
      const curryCb = produce(() => Promise.resolve(2));
      curryCb({ tip: 'react base state' });
    } catch (e: any) {
      console.log('e.message ', e.message);
      expect(e.message).toMatch(/(?=produce callback can not be a promise function or result)/);
    }

    try {
      const curryCb = produce((draft: any) => { draft.a = 1 });
      curryCb(2);
    } catch (e: any) {
      expect(e.message).toMatch(/(?=type can only be map, set, object\(except null\) or array)/);
    }
  });

  test('wrong finishDraft', () => {
    try {
      finishDraft({ a: 1 });
    } catch (e: any) {
      expect(e.message).toMatch(/(?=oops, not a Limu draft)/);
    }
  });

  test('wrong finishDraft 2', () => {
    try {
      const limu1 = new Limu();
      const draft1 = limu1.createDraft({ a: 1 })
      const limu2 = new Limu();

      limu2.finishDraft(draft1);
    } catch (e: any) {
      expect(e.message).toMatch(/(?=does not match finishDraft handler)/);
    }
  });

  test('getDraftMeta', () => {
    const base = { key: 1 };
    const draft = createDraft(base);
    expect(getDraftMeta(draft)).toBeTruthy();
    const final = finishDraft(draft);
    expect(final).toBeTruthy();
  });

  test('deepFreeze obj', () => {
    const obj: any = { a: { b: 1 } };
    deepFreeze(obj);
    expect(Object.isFrozen(obj)).toBeTruthy();
    expect(Object.isFrozen(obj.a)).toBeTruthy();
    assignFrozenDataInJest(() => {
      obj.a1 = 100;
    });
  });

  test('deepFreeze arr', () => {
    const arr: any = [];
    deepFreeze(arr);
    expect(Object.isFrozen(arr)).toBeTruthy();
    assignFrozenDataInJest(() => {
      arr.push(2);
    });
  });

  test('deepFreeze set', () => {
    const set = new Set();
    deepFreeze(set);
    expect(Object.isFrozen(set)).toBeTruthy();
    assignFrozenDataInJest(() => {
      set.add(1);
    });
    expect(set.size === 0).toBeTruthy();
  });

  test('deepFreeze map', () => {
    const map = new Map();
    deepFreeze(map);
    expect(Object.isFrozen(map)).toBeTruthy();
    assignFrozenDataInJest(() => {
      map.set(1, 1);
    });
    expect(map.size === 0).toBeTruthy();
  });

  test('original current obj', () => {
    const base = { key1: { x: 1 }, key2: { x: 100 } };
    const draft = createDraft(base);
    draft.key1.x++;
    const orig = original(draft);
    const curr = current(draft); // draft snapshot
    expect(strfy(orig)).toBe('{"key1":{"x":1},"key2":{"x":100}}');
    expect(strfy(curr)).toBe('{"key1":{"x":2},"key2":{"x":100}}');

    draft.key1.x++
    expect(strfy(draft)).toBe('{"key1":{"x":3},"key2":{"x":100}}'); // draft changed
    expect(strfy(curr)).toBe('{"key1":{"x":2},"key2":{"x":100}}'); // curr not changed, still be 2

    const final = finishDraft(draft);
    expect(strfy(base)).toBe('{"key1":{"x":1},"key2":{"x":100}}');
    expect(strfy(final)).toBe('{"key1":{"x":3},"key2":{"x":100}}');
    expect(strfy(curr)).toBe('{"key1":{"x":2},"key2":{"x":100}}');
  });

  test('original with trust for current obj', () => {
    const base = { key1: { x: 1 }, key2: { x: 100 } };
    const draft = createDraft(base);
    draft.key1.x++;
    const orig = original(draft, false);
    const curr = current(draft); // draft snapshot
    expect(strfy(orig)).toBe('{"key1":{"x":1},"key2":{"x":100}}');
    expect(strfy(curr)).toBe('{"key1":{"x":2},"key2":{"x":100}}');
  });

  test('original not draft', () => {
    const base = { tip: 'not draft' };
    const orig = original(base);
    expect(base === orig).toBeTruthy();
  });

  test('current complex obj', () => {
    const base = {
      a: 1,
      b: [1, 2, 3],
      c: { c1: 1, c2: 2 },
      d: new Map([
        [1, 1],
        [2, 2],
      ]),
      e: new Map([
        [1, { a: 1 }],
        [2, { a: 1 }],
      ]),
      f: new Set([1, 2, 3, 4]),
      nested: {
        a: 1,
        b: [1, 2, 3],
        c: { c1: 1, c2: 2 },
        d: new Map([
          [1, 1],
          [2, 2],
        ]),
        e: new Map([
          [1, { a: 1 }],
          [2, { a: 1 }],
        ]),
        f: new Set([1, 2, 3, 4]),
      }
    };
    const draft = createDraft(base);
    draft.c.c2 = 2000;
    draft.b[2] = 2000;
    draft.b.push(3000);
    draft.b.push(4000);
    // @ts-ignore
    draft.e.get(2).a = 2000;
    draft.f.add(2000);
    draft.nested.b[2] = 2000;
    draft.nested.f.add(2000);
    draft.nested.b.push(3000);
    draft.nested.b.push(4000);

    const tmpCopy = current(draft);
    expect(draft !== tmpCopy).toBeTruthy();
    expect(tmpCopy.c.c2 === 2000).toBeTruthy();

    draft.c.c2 = 3000;
    expect(draft.c.c2 === 3000).toBeTruthy();
    expect(tmpCopy.c.c2 === 2000).toBeTruthy();
  });


  test('test onOperate', () => {
    const base = { a: 1, b: 2, c: { c1: 3 } };
    const draft = createDraft(base, {
      onOperate: (params) => {
        const { key, op, value } = params;
        if (key === 'a') {
          expect(op === 'set').toBeTruthy();
          expect(value === 200).toBeTruthy();
        }
        if (key === 'b') {
          expect(op === 'del').toBeTruthy();
          expect(value === null).toBeTruthy();
        }
        if (key === 'c') {
          expect(op === 'get').toBeTruthy();
        }
        if (key === 'c1') {
          expect(op === 'set').toBeTruthy();
          expect(value === 300).toBeTruthy();
        }
      }
    });
    draft.a = 200;
    // @ts-ignore
    delete draft.b;
    draft.c.c1 = 300;
  });

  test('fast mode', () => {
    const base = { a: 1, b: 2, c: { c1: 3 } };
    const draft = createDraft(base, { fast: true });
    draft.a = 200;
    // @ts-ignore
    delete draft.b;
    draft.c.c1 = 300;
    const final = finishDraft(draft);

    expect(base !== final).toBeTruthy();
    expect(base.a === 1).toBeTruthy();
    expect(base.b === 2 ).toBeTruthy();
    expect(base.c).toMatchObject({ c1: 3 });
    expect(final.a === 200).toBeTruthy();
    expect(final.b === undefined ).toBeTruthy();
    expect(final.c).toMatchObject({ c1: 300 });
  });
});
