import { runTestSuit } from '../_util';

function getArrBase() {
  return [1, 2, 3, 4, 5, 6];
}

function changeDraft(arrDraft: any[]) {
  const result = arrDraft.fill(10, 2, 5);
  expect(result).toMatchObject([1, 2, 10, 10, 10, 6]);
}

function compare(arrNew, arrBase) {
  expect(arrNew).toMatchObject([1, 2, 10, 10, 10, 6]);
  expect(arrBase).toMatchObject([1, 2, 3, 4, 5, 6]);
}

runTestSuit('test fill', 'fill', getArrBase, changeDraft, compare);
