import { getArrBase, runTestSuit } from '../_util';

function changeDraft(arrDraft) {
  const lastItem = arrDraft.pop();
  expect(lastItem === 3).toBeTruthy();
}

function compare(arrNew, arrBase) {
  expect(arrBase.length === 3).toBeTruthy();
  expect(arrNew.length === 2).toBeTruthy();
  expect(arrNew !== arrBase).toBeTruthy();
}

runTestSuit('arr is base', 'pop', getArrBase, changeDraft, compare);

runTestSuit(
  'arr in base obj',
  'pop',
  function getArrBase() {
    return { arr: [1, 2, 3, 4] };
  },
  function changeDraft(draft) {
    draft.arr.pop();
  },
  function compare(draft, base) {
    expect(draft.arr.length === 3).toBeTruthy();
    expect(base.arr.length === 4).toBeTruthy();
  },
);
