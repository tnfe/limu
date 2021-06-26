import { runTestSuit, getArrBase, shouldBeNotEqual } from '../_util';

function changeDraft(arrDraft) {
  delete arrDraft['0'];
}

runTestSuit('test delete', 'delete', getArrBase, changeDraft, shouldBeNotEqual);
