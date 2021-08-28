import { runTestSuit, getArrBase } from '../_util';

function changeDraft(arrDraft) {
  delete arrDraft['0'];
}

function compare(final, base) {
  expect(final !== base).toBeTruthy();
  expect(final[0] === undefined).toBeTruthy();
  expect(base[0] === 1).toBeTruthy();
}

runTestSuit('test delete', 'delete', getArrBase, changeDraft, compare);
