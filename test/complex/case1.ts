import { createDraft, finishDraft } from '../_util';

describe('complex-case1', () => {
  test('run case1', () => {
    const base = {
      numArr: [1, 2, 3, 4],
      mixArr: [
        1,
        { a: 1, b: { c: [1, 2, 3] } },
        new Map([
          ['name', { addr: 'bj' }],
        ]),
        new Set([1, 2, 3, 4]),
      ],
      mixMap: new Map<string, any>([
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

    console.log('final.mixArr[0] ', final.mixArr[0]);
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

  })
});
