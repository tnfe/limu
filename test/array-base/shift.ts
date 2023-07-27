import { getArrBase, runTestSuit } from '../_util';

function changeDraft(arrDraft) {
  const firstItem = arrDraft.shift();
  expect(firstItem === 1).toBeTruthy();
}

function compare(arrNew, arrBase) {
  expect(arrBase.length === 3).toBeTruthy();
  expect(arrNew.length === 2).toBeTruthy();
  expect(arrNew !== arrBase).toBeTruthy();
}

runTestSuit('arr is base', 'shift', getArrBase, changeDraft, compare);

runTestSuit(
  'arr in base obj',
  'shift',
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
