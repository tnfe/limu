import { getArrBase, runTestSuit } from '../_util';

function changeDraft(arrDraft) {
  arrDraft.unshift(0);
}

function compare(arrNew, arrBase) {
  expect(arrNew.length === 4).toBeTruthy();
  expect(arrNew !== arrBase).toBeTruthy();
}

runTestSuit('test unshift', 'unshift', getArrBase, changeDraft, compare);
