import { runTestSuit } from '../_util';

function getArrBase() {
  return [1, 2, 3];
}

function changeDraft(arrDraft) {
  const arrTmp = arrDraft.reverse();
  expect(arrTmp).toMatchObject([3, 2, 1]);
}

function compare(arrNew, arrBase) {
  expect(arrNew !== arrBase).toBeTruthy();
  expect(arrNew).toMatchObject([3, 2, 1]);
}

runTestSuit('arr is base', 'reverse', getArrBase, changeDraft, compare);

runTestSuit('arr in base obj', 'reverse',
  function getArrBase() {
    return { arr: [1, 2, 3, 4] };
  },
  function changeDraft(draft) {
    const arrTmp = draft.arr.reverse();
    expect(arrTmp).toMatchObject([4, 3, 2, 1]);
    arrTmp.pop();
  },
  function compare(draft, base) {
    expect(draft.arr.length === 3).toBeTruthy();
    expect(draft.arr).toMatchObject([4, 3, 2]);
    expect(base.arr.length === 4).toBeTruthy();
    expect(base.arr).toMatchObject([1, 2, 3, 4]);
  },
);
