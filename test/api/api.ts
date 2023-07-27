import {
  createDraft,
  current,
  deepCopy,
  deepFreeze,
  finishDraft,
  getAutoFreeze,
  getDraftMeta,
  getMajorVer,
  original,
  produce,
} from '../../src';
import { assignFrozenDataInJest, strfy } from '../_util';

describe('check apis', () => {
  test('getAutoFreeze', () => {
    expect(getAutoFreeze).toBeTruthy();
    expect(typeof getAutoFreeze() === 'boolean').toBeTruthy();
  });

  test('getMajorVer', () => {
    expect(getMajorVer).toBeTruthy();
    expect(typeof getMajorVer() === 'number').toBeTruthy();
  });

  test('produce', () => {
    const base = { key: 1 };
    const final = produce(base, (draft) => {
      draft.key = 2;
    });

    expect(final.key === 2).toBeTruthy();

    base.key = 100;
    expect(base.key).toBe(100); // base is unfrozen
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
      expect(e.message).toMatch(/(?=produce callback can not be a promise function or result)/);
    }

    try {
      const curryCb = produce((draft: any) => {
        draft.a = 1;
      });
      curryCb(2);
    } catch (e: any) {
      expect(e.message).toMatch(/(?=base state can not be primitive)/);
    }
  });

  test('wrong finishDraft', () => {
    try {
      finishDraft({ a: 1 });
    } catch (e: any) {
      expect(e.message).toMatch(/(?=oops, not a Limu draft)/);
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

    draft.key1.x++;
    expect(strfy(draft)).toBe('{"key1":{"x":3},"key2":{"x":100}}'); // draft changed
    expect(strfy(curr)).toBe('{"key1":{"x":2},"key2":{"x":100}}'); // curr not changed, still be 2

    const final = finishDraft(draft);
    expect(strfy(base)).toBe('{"key1":{"x":1},"key2":{"x":100}}');
    expect(strfy(final)).toBe('{"key1":{"x":3},"key2":{"x":100}}');
    expect(strfy(curr)).toBe('{"key1":{"x":2},"key2":{"x":100}}');
  });

  test('original current primitve', () => {
    const base = { key1: { x: 1 }, key2: { x: 100 } };
    const draft = createDraft(base);
    draft.key1.x++;
    const orig = original(draft.key1.x);
    const curr = current(draft.key1.x);
    expect(orig === 2).toBeTruthy();
    expect(curr === 2).toBeTruthy();

    // second way to get x
    const orig2 = original(draft).key1.x;
    const curr2 = current(draft).key1.x;
    expect(orig2 === 1).toBeTruthy();
    expect(curr2 === 2).toBeTruthy();
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
      },
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
        const { key, op, value, isChange } = params;
        if (!isChange) return;
        if (key === 'a') {
          expect(op === 'set').toBeTruthy();
          expect(value === 200).toBeTruthy();
        }
        if (key === 'b') {
          expect(op === 'del').toBeTruthy();
          expect(value === 2).toBeTruthy();
        }
        if (key === 'c') {
          expect(op === 'get').toBeTruthy();
        }
        if (key === 'c1') {
          expect(op === 'set').toBeTruthy();
          expect(value === 300).toBeTruthy();
        }
      },
    });
    draft.a = 200;
    // @ts-ignore
    delete draft.b;
    draft.c.c1 = 300;
  });

  function testForFast(fastModeRange) {
    const base = { a: 1, b: 2, c: { c1: 3 }, d: [1, 2, 3] };
    let onOperateHit = 0;
    let opArrHit = 0;
    const draft = createDraft(base, {
      fastModeRange,
      onOperate: (params) => {
        if (!params.isChange || params.isBuiltInFnKey) return;
        console.log(params);
        onOperateHit += 1;
        if (params.parentType === 'Array') opArrHit += 1;
      },
    });
    draft.a = 200;
    // @ts-ignore
    delete draft.b;
    draft.c.c1 = 300;
    draft.d.push(1);
    draft.d.push(2);
    draft.d.push(3);
    const final = finishDraft(draft);

    expect(base !== final).toBeTruthy();
    expect(base.a === 1).toBeTruthy();
    expect(base.b === 2).toBeTruthy();
    expect(base.c).toMatchObject({ c1: 3 });
    expect(final.a === 200).toBeTruthy();
    expect(final.b === undefined).toBeTruthy();
    expect(final.c).toMatchObject({ c1: 300 });

    expect(onOperateHit === 9).toBeTruthy();
    expect(opArrHit === 6).toBeTruthy();
  }

  test('fastModeRange all', () => {
    testForFast('all');
  });

  test('fastModeRange none', () => {
    testForFast('none');
  });

  test('deepCopy', () => {
    const base = { a: 1, b: 2, c: { c1: 3 }, d: [1, 2, 3] };
    const final = deepCopy(base);
    final.a = 100;
    final.d.push(4);

    expect(base !== final).toBeTruthy();
    expect(base.a === 1).toBeTruthy();
    expect(final.a === 100).toBeTruthy();
    expect(base.d.length === 3).toBeTruthy();
    expect(final.d.length === 4).toBeTruthy();
  });

  test('deepCopy root arr', () => {
    const base = [{ a: 1 }, { a: 1 }, { a: 1 }];
    const final = deepCopy(base);
    final[0].a = 100;
    final.push({ a: 4 });

    expect(base !== final).toBeTruthy();
    expect(base[0].a === 1).toBeTruthy();
    expect(final[0].a === 100).toBeTruthy();
    expect(base.length === 3).toBeTruthy();
    expect(final.length === 4).toBeTruthy();
  });
});
