import { runTestSuit, noop } from '../_util';

function getAnArrCanBeSort() {
  return [3, 1, 2, 4, 4, 5];
}

function sortDraft(arrDraft: any[]) {
  console.log('before sort', arrDraft);
  const sortedDraft = arrDraft.sort();
  console.log('after sort 1 ', arrDraft);
  console.log('after sort 2 ', sortedDraft);
  expect(sortedDraft).toMatchObject([1, 2, 3, 4, 4, 5]);
  expect(arrDraft).toMatchObject([1, 2, 3, 4, 4, 5]);
  // expect(arrDraft === sortedDraft);
}

// sort will only effect proxyState(draftState)
function compare(arrNew, arrBase) {
  noop(arrNew, arrBase);
  // the finishedState is [1, 2, 3, 4, 4, 5]
  expect(arrNew).toMatchObject([1, 2, 3, 4, 4, 5]);
  console.log('arrNew ', arrNew);
  // the baseState is [3, 1, 2, 4, 4, 5]
  expect(arrBase).toMatchObject([3, 1, 2, 4, 4, 5]);
  console.log('arrBase ', arrBase);
}


runTestSuit('test sort', 'sort', getAnArrCanBeSort, sortDraft, compare);

