import { getArrBase, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const map = arrDraft.reduce((map, item) => {
    map[item] = item;
    return map;
  }, {});
  expect(map).toMatchObject({ 1: 1, 2: 2, 3: 3 });
}

runTestSuit('arr is base', 'reduce', getArrBase, changeDraft, shouldBeEqual);

runTestSuit(
  'arr in base obj',
  'reduce',
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
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.arr, base.arr);
  },
);
