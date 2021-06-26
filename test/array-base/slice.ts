import { getArrBase, runTestSuit, shouldBeEqual, shouldBeNotEqual } from '../_util';

function justSlice(arrDraft, arrBase) {
  const arrDraftNew = arrDraft.slice();
  expect(arrDraftNew !== arrBase).toBeTruthy();
}

runTestSuit('test slice', 'slice', getArrBase, justSlice, shouldBeEqual);

function sliceThenChangeDraft(arrDraft, arrBase) {
  const arrDraftNew = arrDraft.slice();
  arrDraft.push(4);
  expect(arrDraftNew !== arrBase).toBeTruthy();
}

runTestSuit('test slice then change draft', 'slice', getArrBase, sliceThenChangeDraft, shouldBeNotEqual);

