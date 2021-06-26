import { runTestSuit, shouldBeEqual } from '../_util';

function getArrBase(){
  return [1, [2, [3, [4, 5]]], 6];
}

function changeDraft(arrDraft) {
  // @ts-ignore
  const result = arrDraft.flat(Infinity);
  expect(result).toMatchObject([1, 2, 3, 4, 5, 6]);
}

runTestSuit('test flat', 'flat', getArrBase, changeDraft, shouldBeEqual);
