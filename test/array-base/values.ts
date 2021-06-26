import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  // return Array Iterator
  const result = arrDraft.values();
  expect(result).toBeTruthy();
}

runTestSuit('test values', 'values', getArrBase, changeDraft, shouldBeEqual);
