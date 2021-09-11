import { runTestSuit } from '../_util';

function getArrBase() {
  return [1, 2, 3, 4, 5, 6];
}

function changeDraft(arrDraft: any[]) {
  const result = arrDraft.fill(10, 2, 5);
  expect(result).toMatchObject([1, 2, 10, 10, 10, 6]);
}

function compare(arrNew, arrBase) {
  expect(arrNew).toMatchObject([1, 2, 10, 10, 10, 6]);
  expect(arrBase).toMatchObject([1, 2, 3, 4, 5, 6]);
}

runTestSuit('arr is base', 'fill', getArrBase, changeDraft, compare);


runTestSuit('arr in base obj', 'fill',
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
