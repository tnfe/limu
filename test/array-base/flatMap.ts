import { runTestSuit, shouldBeEqual } from '../_util';

function getArrBase() {
  return [2, 3, 4];
}

function changeDraft(arrDraft) {
  // @ts-ignore
  const result = arrDraft.flatMap((x) => [x, x * 2]);
  expect(result).toMatchObject([2, 4, 3, 6, 4, 8]);
}


runTestSuit('arr is base', 'flatMap', getArrBase, changeDraft, shouldBeEqual);

runTestSuit('arr in base obj', 'flatMap',
  () => { // get base state
    return { arr: [2, 3, 4] };
  },
  (draft) => { // change draft
    // @ts-ignore
    const result = draft.arr.flatMap((x) => [x, x * 2]);
    expect(result).toMatchObject([2, 4, 3, 6, 4, 8]);
  },
  (final, base) => { // assert
    expect(final === base).toBeTruthy();
    expect(final.arr === base.arr).toBeTruthy();
  },
);