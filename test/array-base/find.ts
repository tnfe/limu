import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.find(item => item === 1);
  expect(result === 1).toBeTruthy();
}

runTestSuit('test find', 'find', getArrBase, changeDraft, shouldBeEqual);
