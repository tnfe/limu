import { runTestSuit, noop } from '../_util';

function getAnArrCanBeSort() {
  return [3, 1, 2, 4, 4, 5];
}

function sortDraft(arrDraft: any[]) {
  const sortedDraft = arrDraft.sort();
  expect(sortedDraft).toMatchObject([1, 2, 3, 4, 4, 5]);
  expect(arrDraft).toMatchObject([1, 2, 3, 4, 4, 5]);
}

// sort will only effect proxyState(draftState)
function compare(arrNew, arrBase) {
  noop(arrNew, arrBase);
  expect(arrNew).toMatchObject([1, 2, 3, 4, 4, 5]);
  expect(arrBase).toMatchObject([3, 1, 2, 4, 4, 5]);
}

runTestSuit('arr is base', 'sort2', getAnArrCanBeSort, sortDraft, compare);

runTestSuit('arr in base obj', 'sort2',
  () => { // get base state
    return { arr: getAnArrCanBeSort() };
  },
  (draft) => { // change draft
    sortDraft(draft.arr);
  },
  (final, base) => { // assert
    expect(final !== base).toBeTruthy();
    compare(final.arr, base.arr);
  },
);
