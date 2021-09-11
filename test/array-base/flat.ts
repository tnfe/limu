import { runTestSuit, shouldBeEqual } from '../_util';

function getArrBase() {
  return [1, [2, [3, [4, 5]]], 6];
}

function changeDraft(arrDraft) {
  // @ts-ignore
  const result = arrDraft.flat(Infinity);
  expect(result).toMatchObject([1, 2, 3, 4, 5, 6]);
}

runTestSuit('arr is base', 'flat', getArrBase, changeDraft, shouldBeEqual);

runTestSuit('arr in base obj', 'flat',
  function getArrBase() {
    return { arr: [1, [2, [3, [4, 5]]], 6] };
  },
  function changeDraft(draft) {
    // @ts-ignore
    const result = draft.arr.flat(Infinity);
    expect(result).toMatchObject([1, 2, 3, 4, 5, 6]);
  },
  function compare(draft, base) {
    expect(draft === base).toBeTruthy();
    expect(draft.arr === base.arr).toBeTruthy();
  },
);

