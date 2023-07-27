import { getArrBase, runTestSuit, shouldBeEqual } from '../_util';

function operateDraft(arrDraft: any[]) {
  const arrTmp = arrDraft.map((item, i) => {
    return item * i;
  });
  expect(arrTmp).toMatchObject([0, 2, 6]);
}

runTestSuit('arr is base', 'map', getArrBase, operateDraft, shouldBeEqual);

runTestSuit(
  'arr in base obj',
  'map',
  () => {
    // get base state
    return { arr: getArrBase() };
  },
  (draft) => {
    // change draft
    operateDraft(draft.arr);
  },
  (final, base) => {
    // assert
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.arr, base.arr);
  },
);

// 在 map 过程中故意修改 arr 对应下标的值
function changeDraft(arrDraft: any[]) {
  const arrTmp = arrDraft.map((item, i, arr) => {
    arr.push('cool');
    arr[i] = item + 10;
    return item * i;
  });
  expect(arrTmp).toMatchObject([0, 2, 6]);
}

function compare(arrNew, arrBase) {
  expect(arrNew).toMatchObject([11, 12, 13, 'cool', 'cool', 'cool']);
  expect(arrBase !== arrNew).toBeTruthy();
}

runTestSuit('arr is base', 'modify item in map process', getArrBase, changeDraft, compare);

runTestSuit(
  'arr in base obj',
  'modify item in map process',
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
