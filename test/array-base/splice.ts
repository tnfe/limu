import { getArrBase, runTestSuit } from '../_util';

function changeDraft(arrDraft) {
  const slicedDraft = arrDraft.splice(0, 1);
  const slicedDraft2 = arrDraft.splice(0, 1);
  expect(slicedDraft).toMatchObject([1]);
  expect(slicedDraft2).toMatchObject([2]);
}

function compare(arrNew, arrBase) {
  expect(arrNew !== arrBase).toBeTruthy();
  expect(arrBase).toMatchObject([1, 2, 3]);
  expect(arrNew).toMatchObject([3]);
}

runTestSuit('arr is base', 'splice', getArrBase, changeDraft, compare);

runTestSuit(
  'arr in base obj',
  'splice',
  () => {
    // get base state
    return { arr: getArrBase() };
  },
  (draft) => {
    // change draft
    changeDraft(draft.arr);
  },
  (final, base) => {
    // assert
    expect(final !== base).toBeTruthy();
    compare(final.arr, base.arr);
  },
);

runTestSuit(
  'obj arr in base obj',
  'splice',
  () => {
    return { arr: [{ name: 1 }] };
  },
  (draft) => {
    const slicedDraft = draft.arr.splice(0, 1);
    expect(slicedDraft).toMatchObject([{ name: 1 }]);
  },
  (final, base) => {
    expect(final !== base).toBeTruthy();
    expect(final.arr !== base.arr).toBeTruthy();
    expect(final.arr).toMatchObject([]);
    expect(base.arr).toMatchObject([{ name: 1 }]);
  },
  { fastModeRange: 'none' },
);
