import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.filter(item => item > 1);
  expect(result).toMatchObject([2, 3]);
}

runTestSuit('test filter', 'filter', getArrBase, changeDraft, shouldBeEqual);
