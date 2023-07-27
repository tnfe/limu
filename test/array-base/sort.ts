// @ts-nocheck
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

function compare(arrNew, arrBase) {
  expect(arrNew).toMatchObject([1, 2, 3, 4, 4, 5]);
  expect(arrBase).toMatchObject([3, 1, 2, 4, 4, 5]);
}

runTestSuit('arr is base', 'sort', getAnArrCanBeSort, sortDraft, compare);

runTestSuit(
  'arr in base obj',
  'sort',
  () => {
    // get base state
    return { arr: getAnArrCanBeSort() };
  },
  (draft) => {
    // change draft
    sortDraft(draft.arr);
  },
  (final, base) => {
    // assert
    expect(final !== base).toBeTruthy();
    compare(final.arr, base.arr);
  },
);

function getAnOrderedArr() {
  return [1, 2, 3, 4, 5];
}

function sortOrderedDraft(arrDraft: any[], base: any[]) {
  const sortedDraft = arrDraft.sort();
  expect(sortedDraft).toMatchObject([1, 2, 3, 4, 5]);
  expect(sortedDraft === arrDraft).toBeTruthy();
  expect(sortedDraft === base).toBeFalsy();
}

runTestSuit('arr is base', 'ordered sort', getAnOrderedArr, sortOrderedDraft, shouldBeNotEqual);
runTestSuit(
  'arr in base obj',
  'ordered sort',
  () => {
    // get base state
    return { arr: getAnOrderedArr() };
  },
  (draft) => {
    // change draft
    sortOrderedDraft(draft.arr);
  },
  (final, base) => {
    // assert
    expect(final !== base).toBeTruthy();
    shouldBeNotEqual(final.arr, base.arr);
  },
);

function getAnUnorderedArr() {
  return [1, 2, 3, 4, 5, 1];
}

function sortUnorderedDraft(arrDraft: any[], base: any[]) {
  const sortedDraft = arrDraft.sort();
  expect(sortedDraft).toMatchObject([1, 1, 2, 3, 4, 5]);
  expect(sortedDraft === arrDraft).toBeTruthy();
  expect(sortedDraft === base).toBeFalsy();
}

runTestSuit('arr is base', 'unordered sort', getAnUnorderedArr, sortUnorderedDraft, shouldBeNotEqual);
runTestSuit(
  'arr in base obj',
  'unordered sort',
  () => {
    return { arr: getAnOrderedArr() };
  },
  (draft) => {
    sortOrderedDraft(draft.arr);
  },
  (final, base) => {
    expect(final !== base).toBeTruthy();
    shouldBeNotEqual(final.arr, base.arr);
  },
);
