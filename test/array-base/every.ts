import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.every(item => item !== 0);
  expect(result).toBeTruthy();
}

runTestSuit('test every', 'every', getArrBase, changeDraft, shouldBeEqual);
