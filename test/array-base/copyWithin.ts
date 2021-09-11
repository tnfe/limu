import { runTestSuit } from '../_util';

function getArrBase() {
  return [100, 200, 1, 2, 3, 4];
}

function changeDraft(arrDraft: any[]) {
  const arrTmp = arrDraft.copyWithin(3, 1, 3);
  expect(arrTmp).toMatchObject([100, 200, 1, 200, 1, 4]);
}

function compare(arrNew, arrBase) {
  expect(arrNew !== arrBase).toBeTruthy();
  expect(arrNew).toMatchObject([100, 200, 1, 200, 1, 4]);
  expect(arrBase).toMatchObject([100, 200, 1, 2, 3, 4]);
}

runTestSuit('arr is base', 'copyWithin', getArrBase, changeDraft, compare, true);

runTestSuit('arr in base obj', 'copyWithin',
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
