import { runTestSuit } from '../_util';

runTestSuit(
  'case-object-nested',
  'case nested',
  () => {
    // base data
    const mapBase = new Map<string, any>([
      [
        'key1',
        {
          id: 1,
          a: { b: [{ b1: [{ c1: 1 }] }], b_rest: { r1: 1 } },
          rest: { r1: 1 },
        },
      ],
      [
        'key2',
        {
          id: 1,
          a: { b: [{ b1: [{ c1: 1 }] }], b_rest: { r1: 1 } },
          rest: { r1: 1 },
        },
      ],
    ]);
    return mapBase;
  },
  (draft) => {
    // change draft
    draft.get('key1').a.b[0].b1[0].c1 = 2;
  },
  (mapFinal, mapBase) => {
    // asset
    expect(mapFinal === mapBase).toBeFalsy();
    const key1Value = mapBase.get('key1');
    const key1NewValue = mapFinal.get('key1');

    expect(key1Value === key1NewValue).toBeFalsy();
    expect(key1Value.a === key1NewValue.a).toBeFalsy();
    expect(key1Value.a.b === key1NewValue.a.b).toBeFalsy();
    expect(key1Value.a.b_rest === key1NewValue.a.b_rest).toBeTruthy();
    expect(key1Value.rest === key1NewValue.rest).toBeTruthy();

    expect(mapBase.get('key1').a.b[0].b1[0].c1 === 1).toBeTruthy();
    expect(mapFinal.get('key1').a.b[0].b1[0].c1 === 2).toBeTruthy();

    expect(mapBase.get('key2') === mapBase.get('key2')).toBeTruthy();
  },
);
