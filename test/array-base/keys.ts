import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  // return Array Iterator
  const result = arrDraft.keys();
  expect(result).toBeTruthy();
}

runTestSuit('test keys', 'keys', getArrBase, changeDraft, shouldBeEqual);
