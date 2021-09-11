import { runTestSuit, getArrBase, shouldBeEqual, noop } from '../_util';

function changeDraft(arrDraft) {
  const result = arrDraft.findIndex(item => item === 1);
  expect(result === 0).toBeTruthy();
}

runTestSuit('arr is base', 'findIndex', getArrBase, changeDraft, shouldBeEqual);

runTestSuit('arr in base obj', 'findIndex',
  function getArrBase() {
    return { arr: [1, 2, 3, 4] };
  },
  function changeDraft(draft) {
    const result = draft.arr.findIndex(item => item === 1);
    expect(result === 0).toBeTruthy();
  },
  function compare(final, base) {
    noop(final, base);
    expect(final === base).toBeTruthy();
    expect(final.arr === base.arr).toBeTruthy();
  },
);
