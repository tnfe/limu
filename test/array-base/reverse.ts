import { runTestSuit } from '../_util';

function getArrBase() {
  return [1, 2, 3];
}

function changeDraft(arrDraft) {
  const arrTmp = arrDraft.reverse();
  expect(arrTmp).toMatchObject([3, 2, 1]);
}

function compare(arrNew, arrBase) {
  expect(arrNew !== arrBase).toBeTruthy();
  expect(arrNew).toMatchObject([3, 2, 1]);
}

runTestSuit('test reverse', 'reverse', getArrBase, changeDraft, compare);
