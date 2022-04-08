import { runTestSuit, getArrBase, shouldBeEqual, shouldBeNotEqual, noop } from '../_util';

// const caseSkips = [false, false, false, false, false ,false];
const caseSkips = [true, true, true, true, true, false];

function changeDraft(arrDraft: any[]) {
  arrDraft.forEach((item, i) => {
    arrDraft[i] = 100 + item;
  });
}

function compare(arrNew, arrBase) {
  expect(arrNew !== arrBase).toBeTruthy();
  expect(arrNew).toMatchObject([101, 102, 103]);
}

runTestSuit('arr is base', 'forEach change item with draft', getArrBase, changeDraft, compare, caseSkips[0]);


runTestSuit('arr in base obj', 'forEach change item with draft',
  () => { // get base state
    return { arr: getArrBase() };
  },
  (draft) => { // change draft
    changeDraft(draft.arr);
  },
  (final, base) => { // assert
    expect(final !== base).toBeTruthy();
    compare(final.arr, base.arr);
  },
  caseSkips[1],
);

function noopDraftItem(arrDraft) {
  arrDraft.forEach((item) => {
    noop(item);
  });
}

runTestSuit('arr is base', 'forEach do nothing', getArrBase, noopDraftItem, shouldBeEqual, caseSkips[2]);


runTestSuit('arr in base obj', 'forEach do nothing',
  () => { // get base state
    return { arr: getArrBase() };
  },
  (draft) => { // change draft
    noopDraftItem(draft.arr);
  },
  (final, base) => { // assert
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.arr, base.arr);
  },
  caseSkips[3],
);


function changeDraftWithCbArr(arrDraft: any[]) {
  arrDraft.forEach((item, i, arr) => {
    arr[i] = 100 + item;
  });
}

runTestSuit('arr is base', 'forEach change item with 3th arr param', getArrBase, changeDraftWithCbArr, shouldBeEqual, caseSkips[4]);


runTestSuit('arr in base obj', 'forEach change item with 3th arr param',
  () => { // get base state
    return { arr: getArrBase() };
  },
  (draft) => { // change draft
    changeDraftWithCbArr(draft.arr);
  },
  (final, base) => { // assert
    expect(final !== base).toBeTruthy();
    shouldBeNotEqual(final.arr, base.arr);
  },
  caseSkips[5],
);

