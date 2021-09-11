import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const arrTmp = arrDraft.concat([4, 5]);
  expect(arrTmp).toMatchObject([1, 2, 3, 4, 5]);
}

runTestSuit('arr is base', 'concat', getArrBase, changeDraft, shouldBeEqual);

runTestSuit('arr in base obj', 'concat',
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
