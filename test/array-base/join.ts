import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.join(',');
  expect(result === '1,2,3').toBeTruthy();
}

runTestSuit('test join', 'join', getArrBase, changeDraft, shouldBeEqual);
