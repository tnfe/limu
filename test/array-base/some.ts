import { getArrBase, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.some(item => item === 1);
  expect(result).toBeTruthy();
}

runTestSuit('arr is base', 'some', getArrBase, changeDraft, shouldBeEqual);

runTestSuit('arr in base obj', 'some',
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
