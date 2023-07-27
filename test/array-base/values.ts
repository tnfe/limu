import { getArrBase, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  // return Array Iterator
  const result = arrDraft.values();
  expect(result).toBeTruthy();
}

runTestSuit('arr is base', 'values', getArrBase, changeDraft, shouldBeEqual);

runTestSuit(
  'arr in base obj',
  'values',
  () => {
    // get base state
    return { arr: getArrBase() };
  },
  (draft) => {
    // change draft
    changeDraft(draft.arr);
  },
  (final, base) => {
    // assert
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.arr, base.arr);
  },
);
