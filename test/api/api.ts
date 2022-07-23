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
      const curryCb = produce(async () => { });
      curryCb({ tip: 'react base state' });
    } catch (e: any) {
      expect(e.message).toMatch(/(?=produce callback can not be a promise function)/);
    }

    try {
      const curryCb = produce((draft: any) => { draft.a = 1 });
      curryCb(2);
    } catch (e: any) {
      expect(e.message).toMatch(/(?=type can only be object\(except null\) or array)/);
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

});