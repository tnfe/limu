import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.includes(1);
  expect(result).toBeTruthy();
}

runTestSuit('test includes', 'includes', getArrBase, changeDraft, shouldBeEqual);
