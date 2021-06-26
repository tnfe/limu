import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.findIndex(item => item === 1);
  expect(result === 0).toBeTruthy();
}

runTestSuit('test findIndex', 'findIndex', getArrBase, changeDraft, shouldBeEqual);
