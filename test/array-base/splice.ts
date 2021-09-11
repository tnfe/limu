import { getArrBase, runTestSuit } from '../_util';

function changeDraft(arrDraft) {
  const slicedDraft = arrDraft.splice(0, 1);
  expect(slicedDraft).toMatchObject([1]);
}

function compare(arrNew, arrBase) {
  expect(arrNew !== arrBase).toBeTruthy();
  expect(arrBase).toMatchObject([1, 2, 3]);
  expect(arrNew).toMatchObject([2, 3]);
}

runTestSuit('arr is base', 'splice', getArrBase, changeDraft, compare);

runTestSuit('arr in base obj', 'splice',
  () => { // get base state
    return { arr: getArrBase() };
  },
  (draft) => { // change draft
    changeDraft(draft.arr);
  },
  (final, base) => { // assert
    expect(final !== base).toBeTruthy();
    compare(final.arr, base.arr);
  },
);
