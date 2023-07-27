import { getArrBase, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.every((item) => item !== 0);
  expect(result).toBeTruthy();
}

runTestSuit('arr is base', 'every', getArrBase, changeDraft, shouldBeEqual);

runTestSuit(
  'arr in base obj',
  'every',
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
