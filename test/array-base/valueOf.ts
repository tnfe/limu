import { runTestSuit, getArrBase, shouldBeEqual } from '../_util';

function changeDraft(arrDraft: any[]) {
  // return Array Iterator
  const result = arrDraft.valueOf();
  expect(result).toMatchObject([1, 2, 3]);
}

runTestSuit('test valueOf', 'valueOf', getArrBase, changeDraft, shouldBeEqual);
