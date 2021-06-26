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

runTestSuit('test splice', 'splice', getArrBase, changeDraft, compare);
