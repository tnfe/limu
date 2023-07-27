import { getArrBase, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(arrDraft: any[]) {
  // return Array Iterator
  const result = arrDraft.valueOf();
  expect(result).toMatchObject([1, 2, 3]);
}

runTestSuit('arr is base', 'valueOf', getArrBase, changeDraft, shouldBeEqual);

runTestSuit(
  'arr in base obj',
  'valueOf',
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
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.arr, base.arr);
  },
);
