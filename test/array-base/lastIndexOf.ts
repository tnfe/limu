import { runTestSuit, shouldBeEqual } from '../_util';

function getArrBase() {
  return [1, 2, 3, 1];
}

function changeDraft(arrDraft) {
  const result = arrDraft.lastIndexOf(1);
  expect(result === 3).toBeTruthy();
}

runTestSuit('arr is base', 'lastIndexOf', getArrBase, changeDraft, shouldBeEqual);

runTestSuit('arr in base obj', 'lastIndexOf',
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
