import { runTestSuit, getArrBase, shouldBeEqual, noop } from '../_util';

function changeDraft(arrDraft) {
  noop(arrDraft);
}

runTestSuit('test nothing', 'nothing', getArrBase, changeDraft, shouldBeEqual);
