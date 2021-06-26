import { runTestSuit, shouldBeEqual } from '../_util';

function getArrBase() {
  return [2, 3, 4];
}

function changeDraft(arrDraft) {
  // @ts-ignore
  const result = arrDraft.flatMap((x) => [x, x * 2]);
  expect(result).toMatchObject([2, 4, 3, 6, 4, 8]);
}

runTestSuit('test flatMap', 'flatMap', getArrBase, changeDraft, shouldBeEqual);
