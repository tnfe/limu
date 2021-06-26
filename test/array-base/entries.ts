import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft: any[]) {
  // return Array Iterator {}
  const entries = arrDraft.entries();
  expect(entries).toBeTruthy();
}

runTestSuit('test entries', 'entries', getArrBase, changeDraft, shouldBeEqual);
