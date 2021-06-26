import { getArrBase, runTestSuit } from '../_util';

function changeDraft(arrDraft) {
  arrDraft.push(4);
}

function compare(arrNew, arrBase) {
  expect(arrBase.length === 3).toBeTruthy();
  expect(arrNew.length === 4).toBeTruthy();
  expect(arrNew !== arrBase).toBeTruthy();
}

runTestSuit('test push', 'push', getArrBase, changeDraft, compare);
