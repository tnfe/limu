import { runTestSuit } from '../_util';

runTestSuit(
  'diff: arr in base obj',
  'ordered sort',
  () => {
    return { arr: [1, 2, 3, 4, 5] };
  },
  (draft) => {
    const sortedArr = draft.arr.sort();
    expect(sortedArr === draft.arr);
    expect(sortedArr).toMatchObject([1, 2, 3, 4, 5]);
  },
  (final, base) => {
    expect(final === base).toBeFalsy(); // limu think this is false cause its shallow copy on read mechanism
    // expect(final === base).toBeTruthy();
  },
);

runTestSuit(
  'diff: arr in base obj',
  'unordered sort',
  () => {
    return { arr: [1, 2, 3, 4, 5, 1] };
  },
  (draft) => {
    const sortedArr = draft.arr.sort();
    expect(sortedArr === draft.arr);
    expect(sortedArr).toMatchObject([1, 1, 2, 3, 4, 5]);
  },
  (final, base) => {
    expect(final !== base).toBeTruthy();
  },
);
