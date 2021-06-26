import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const arrTmp = arrDraft.concat([4, 5]);
  expect(arrTmp).toMatchObject([1, 2, 3, 4, 5]);
}

runTestSuit('test concat', 'concat', getArrBase, changeDraft, shouldBeEqual);

