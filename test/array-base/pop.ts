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

runTestSuit('test pop', 'pop', getArrBase, changeDraft, compare);
