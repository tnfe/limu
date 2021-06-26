import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.indexOf(1);
  expect(result === 0).toBeTruthy();
}

runTestSuit('test indexOf', 'indexOf', getArrBase, changeDraft, shouldBeEqual);
