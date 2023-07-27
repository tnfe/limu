import { getArrBase, noop, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  noop(arrDraft);
}

runTestSuit('test nothing', 'nothing', getArrBase, changeDraft, shouldBeEqual);
