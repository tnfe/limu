import { getArrBase, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(arrDraft: any[]) {
  const map = arrDraft.reduceRight((map, item) => {
    map[item] = item;
    return map;
  }, {});
  expect(map).toMatchObject({ 3: 3, 2: 2, 1: 1 });
}

runTestSuit('arr is base', 'reduceRight', getArrBase, changeDraft, shouldBeEqual);

runTestSuit(
  'arr in base obj',
  'reduceRight',
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
