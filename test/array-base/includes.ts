import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.includes(1);
  expect(result).toBeTruthy();
}

runTestSuit('arr is base', 'includes', getArrBase, changeDraft, shouldBeEqual);

runTestSuit('arr in base obj', 'includes',
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
