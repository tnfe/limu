// @ts-nocheck
import { createDraft, finishDraft } from '../_util';

describe('complex-case1', () => {
  test('run case1', () => {
    const base = {
      numArr: [1, 2, 3, 4],
      mixArr: [1, { a: 1, b: { c: [1, 2, 3] } }, new Map([['name', { addr: 'bj' }]]), new Set([1, 2, 3, 4])],
      mixMap: new Map([
        ['key1', { addr: 'bj' }],
        ['key2', 2],
      ]),
      obj1: { desc: 'i am obj 1' },
      obj2: { desc: 'i am obj 2' },
    };
    const draft = createDraft(base);
    draft.mixArr.push(5);
    draft.mixArr[0] = 100;
    // @ts-ignore
    draft.mixArr[2].get('name').addr = 'sz';
    const final = finishDraft(draft);

    expect(base !== final).toBeTruthy();
    expect(base.mixArr !== final.mixArr).toBeTruthy();

    expect(final.mixArr[0] === 100).toBeTruthy();
    expect(base.mixArr[0] === 1).toBeTruthy();

    // @ts-ignore
    expect(final.mixArr[2].get('name') !== base.mixArr[2].get('name')).toBeTruthy();
    // @ts-ignore
    expect(final.mixArr[2].get('name').addr === 'sz').toBeTruthy();
    // @ts-ignore
    expect(base.mixArr[2].get('name').addr === 'bj').toBeTruthy();

    expect(base.mixMap === final.mixMap).toBeTruthy();
    expect(base.obj1 === final.obj1).toBeTruthy();
    expect(base.obj2 === final.obj2).toBeTruthy();
  });

  test('forEach then change arr item', () => {
    const base = {
      numArr: [1, 2, 3, 4],
      mixArr: [1, { a: 1, b: { c: [1, 2, 3] } }, new Map([['name', { addr: 'bj' }]]), new Set([1, 2, 3, 4])],
      mixMap: new Map([
        ['key1', { addr: 'bj' }],
        ['key2', 2],
      ]),
      obj1: { desc: 'i am obj 1' },
      obj2: { desc: 'i am obj 2' },
    };
    const draft = createDraft(base);
    draft.mixArr.forEach((item, idx, arr) => {
      if (item === 1) {
        arr[idx] = 888;
      }
    });
    draft.mixArr.push(5);
    // @ts-ignore
    draft.mixArr[2].get('name').addr = 'sz';
    const final = finishDraft(draft);

    expect(base !== final).toBeTruthy();
    expect(base.mixArr !== final.mixArr).toBeTruthy();

    expect(final.mixArr[0] === 888).toBeTruthy();
    expect(base.mixArr[0] === 1).toBeTruthy();

    // @ts-ignore
    expect(final.mixArr[2].get('name') !== base.mixArr[2].get('name')).toBeTruthy();
    // @ts-ignore
    expect(final.mixArr[2].get('name').addr === 'sz').toBeTruthy();
    // @ts-ignore
    expect(base.mixArr[2].get('name').addr === 'bj').toBeTruthy();

    expect(base.mixMap === final.mixMap).toBeTruthy();
    expect(base.obj1 === final.obj1).toBeTruthy();
    expect(base.obj2 === final.obj2).toBeTruthy();
  });

  test('change arr item then forEach', () => {
    const base = {
      numArr: [1, 2, 3, 4],
      mixArr: [1, { a: 1, b: { c: [1, 2, 3] } }, new Map([['name', { addr: 'bj' }]]), new Set([1, 2, 3, 4])],
      mixMap: new Map([
        ['key1', { addr: 'bj' }],
        ['key2', 2],
      ]),
      obj1: { desc: 'i am obj 1' },
      obj2: { desc: 'i am obj 2' },
    };
    const draft = createDraft(base);
    draft.mixArr[0] = 666;
    draft.mixArr.push(5);
    // @ts-ignore
    draft.mixArr[2].get('name').addr = 'sz';
    draft.mixArr.forEach((item, idx, arr) => {
      if (item === 666) {
        arr[idx] = 888;
      }
    });
    const final = finishDraft(draft);

    expect(base !== final).toBeTruthy();
    expect(base.mixArr !== final.mixArr).toBeTruthy();

    expect(final.mixArr[0] === 888).toBeTruthy();
    expect(base.mixArr[0] === 1).toBeTruthy();

    // @ts-ignore
    expect(final.mixArr[2].get('name') !== base.mixArr[2].get('name')).toBeTruthy();
    // @ts-ignore
    expect(final.mixArr[2].get('name').addr === 'sz').toBeTruthy();
    // @ts-ignore
    expect(base.mixArr[2].get('name').addr === 'bj').toBeTruthy();

    expect(base.mixMap === final.mixMap).toBeTruthy();
    expect(base.obj1 === final.obj1).toBeTruthy();
    expect(base.obj2 === final.obj2).toBeTruthy();
  });
});
