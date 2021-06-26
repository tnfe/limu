import { getArrBase, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.some(item => item === 1);
  expect(result).toBeTruthy();
}

runTestSuit('test some', 'some', getArrBase, changeDraft, shouldBeEqual);
