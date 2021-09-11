import { runTestSuit, getArrBase } from '../_util';

function changeDraft(arrDraft) {
  delete arrDraft['0'];
  expect(JSON.stringify(arrDraft)).toBe('[null,2,3]');
}

function compare(final, base) {
  expect(final !== base).toBeTruthy();
  expect(final[0] === undefined).toBeTruthy();
  expect(base[0] === 1).toBeTruthy();
  expect(JSON.stringify(final)).toBe('[null,2,3]');
  expect(JSON.stringify(base)).toBe('[1,2,3]');
}

runTestSuit('arr is base', 'delete', getArrBase, changeDraft, compare);

runTestSuit('arr in base obj', 'delete',
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
