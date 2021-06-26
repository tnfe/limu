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

runTestSuit('test shift', 'shift', getArrBase, changeDraft, compare);
