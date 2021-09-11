import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft: any[]) {
  // return Array Iterator {}
  const entries = arrDraft.entries();
  expect(entries).toBeTruthy();
}

runTestSuit('arr is base', 'entries', getArrBase, changeDraft, shouldBeEqual);

runTestSuit('arr in base obj', 'entries',
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
