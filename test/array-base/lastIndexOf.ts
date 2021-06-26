import { runTestSuit, shouldBeEqual } from '../_util';

function getArrBase(){
  return [1, 2, 3, 1];
}

function changeDraft(arrDraft) {
  const result = arrDraft.lastIndexOf(1);
  expect(result === 3).toBeTruthy();
}

runTestSuit('test lastIndexOf', 'lastIndexOf', getArrBase, changeDraft, shouldBeEqual);
