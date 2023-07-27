import { getArrBase, noop, runTestSuit, shouldBeEqual, shouldBeNotEqual } from '../_util';

function changeDraft(arrDraft: any[]) {
  arrDraft.forEach((item, i) => {
    arrDraft[i] = 100 + item;
  });
}

function compare(arrNew, arrBase) {
  expect(arrNew !== arrBase).toBeTruthy();
  expect(arrNew).toMatchObject([101, 102, 103]);
}

runTestSuit('arr is base', 'forEach change item with draft', getArrBase, changeDraft, compare);

runTestSuit(
  'arr in base obj',
  'forEach change item with draft',
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

function noopDraftItem(arrDraft) {
  arrDraft.forEach((item) => {
    noop(item);
  });
}

runTestSuit('arr is base', 'forEach do nothing', getArrBase, noopDraftItem, shouldBeEqual);

runTestSuit(
  'arr in base obj',
  'forEach do nothing',
  () => {
    // get base state
    return { arr: getArrBase() };
  },
  (draft) => {
    // change draft
    noopDraftItem(draft.arr);
  },
  (final, base) => {
    // assert
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.arr, base.arr);
  },
);

function changeDraftWithCbArr(arrDraft: any[]) {
  arrDraft.forEach((item, i, arr) => {
    arr[i] = 100 + item;
  });
}

runTestSuit('arr is base', 'forEach change item with 3th arr param', getArrBase, changeDraftWithCbArr, shouldBeNotEqual);

runTestSuit(
  'arr in base obj',
  'forEach change item with 3th arr param',
  () => {
    // get base state
    return { arr: getArrBase() };
  },
  (draft) => {
    // change draft
    changeDraftWithCbArr(draft.arr);
  },
  (final, base) => {
    // assert
    expect(final !== base).toBeTruthy();
    expect(base.arr[0]).toBe(1);
    expect(base.arr[1]).toBe(2);
    expect(base.arr[2]).toBe(3);
    expect(final.arr[0]).toBe(101);
    expect(final.arr[1]).toBe(102);
    expect(final.arr[2]).toBe(103);
    shouldBeNotEqual(final.arr, base.arr);
  },
);
