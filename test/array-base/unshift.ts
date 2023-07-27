import { getArrBase, runTestSuit } from '../_util';

function changeDraft(arrDraft) {
  arrDraft.unshift(0);
}

function compare(arrNew, arrBase) {
  const len = arrNew.length;
  expect(len === 4).toBeTruthy();
  expect(arrNew !== arrBase).toBeTruthy();
}

runTestSuit('arr is base', 'unshift', getArrBase, changeDraft, compare);

runTestSuit(
  'arr in base obj',
  'unshift',
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
    expect(final !== base).toBeTruthy();
    compare(final.arr, base.arr);
  },
);
