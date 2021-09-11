import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.filter(item => item > 1);
  expect(result).toMatchObject([2, 3]);
}

runTestSuit('arr is base', 'filter', getArrBase, changeDraft, shouldBeEqual);

runTestSuit('arr in base obj', 'filter',
  () => { // get base state
    return { arr: getArrBase() };
  },
  (draft) => { // change draft
    changeDraft(draft.arr);
  },
  (final, base) => { // assert
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.arr, base.arr);
  },
);
