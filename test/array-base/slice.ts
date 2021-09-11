import { getArrBase, runTestSuit, shouldBeEqual, shouldBeNotEqual } from '../_util';

function justSlice(arrDraft, arrBase) {
  const arrDraftNew = arrDraft.slice();
  expect(arrDraftNew !== arrBase).toBeTruthy();
}

runTestSuit('arr is base', 'slice', getArrBase, justSlice, shouldBeEqual);

runTestSuit('arr in base obj', 'slice',
  () => { // get base state
    return { arr: getArrBase() };
  },
  (draft, base) => { // change draft
    justSlice(draft.arr, base.arr);
  },
  (final, base) => { // assert
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.arr, base.arr);
  },
);

function sliceThenChangeDraft(arrDraft, arrBase) {
  const arrDraftNew = arrDraft.slice();
  arrDraft.push(4);
  expect(arrDraftNew !== arrBase).toBeTruthy();
}

runTestSuit('arr is base', 'slice', getArrBase, sliceThenChangeDraft, shouldBeNotEqual);

runTestSuit('arr in base obj', 'slice',
  () => { // get base state
    return { arr: getArrBase() };
  },
  (draft, base) => { // change draft
    sliceThenChangeDraft(draft.arr, base.arr);
  },
  (final, base) => { // assert
    expect(final !== base).toBeTruthy();
    shouldBeNotEqual(final.arr, base.arr);
  },
);
