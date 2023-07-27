import { getArrBase, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.join(',');
  expect(result === '1,2,3').toBeTruthy();
}

runTestSuit('arr is base', 'join', getArrBase, changeDraft, shouldBeEqual);

runTestSuit(
  'arr in base obj',
  'join',
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
