import { getArrBase, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.indexOf(1);
  expect(result === 0).toBeTruthy();
}

runTestSuit('arr is base', 'indexOf', getArrBase, changeDraft, shouldBeEqual);

runTestSuit(
  'arr in base obj',
  'indexOf',
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
