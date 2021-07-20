import { runTestSuit, shouldBeNotEqual } from '../_util';

function getAnArrCanBeSort() {
  return [3, 1, 2, 4, 4, 5];
}

function sortDraft(arrDraft: any[]) {
  const sortedDraft = arrDraft.sort();
  expect(sortedDraft).toMatchObject([1, 2, 3, 4, 4, 5]);
  expect(arrDraft).toMatchObject([1, 2, 3, 4, 4, 5]);
  expect(arrDraft === sortedDraft);
}

// sort will only effect proxyState(draftState)
function compare(arrNew, arrBase) {
  // the finishedState is [1, 2, 3, 4, 4, 5]
  expect(arrNew).toMatchObject([1, 2, 3, 4, 4, 5]);
  // the baseState is [3, 1, 2, 4, 4, 5]
  expect(arrBase).toMatchObject([3, 1, 2, 4, 4, 5]);
}


runTestSuit('test sort', 'sort', getAnArrCanBeSort, sortDraft, compare);

function getAnOrderedArr() {
  return [1, 2, 3, 4, 5];
}

function sortOrderedDraft(arrDraft: any[]) {
  const sortedDraft = arrDraft.sort();
  expect(sortedDraft).toMatchObject([1, 2, 3, 4, 5]);
  expect(arrDraft).toMatchObject([1, 2, 3, 4, 5]);
}

runTestSuit('test ordered sort', 'sort', getAnOrderedArr, sortOrderedDraft, shouldBeNotEqual);
