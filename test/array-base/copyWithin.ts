import { runTestSuit } from '../_util';

function getArrBase() {
  return [100, 200, 1, 2, 3, 4];
}

function changeDraft(arrDraft: any[]) {
  const arrTmp = arrDraft.copyWithin(3, 1, 3);
  expect(arrTmp).toMatchObject([100, 200, 1, 200, 1, 4]);
}

function compare(arrNew, arrBase) {
  expect(arrNew !== arrBase).toBeTruthy();
  expect(arrNew).toMatchObject([100, 200, 1, 200, 1, 4]);
  expect(arrBase).toMatchObject([100, 200, 1, 2, 3, 4]);
}

runTestSuit('test copyWithin', 'copyWithin', getArrBase, changeDraft, compare);

