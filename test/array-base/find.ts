import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.find(item => item === 1);
  expect(result === 1).toBeTruthy();
}

runTestSuit('arr is base', 'find', getArrBase, changeDraft, shouldBeEqual);

runTestSuit('arr in base obj', 'find',
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
