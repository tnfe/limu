import { runSetTestSuit, getSetBase, shouldBeEqual, noop } from '../_util';

function operateDraft(setDraft: Set<any>) {
  setDraft.forEach(item => noop(item));
}

runSetTestSuit('test set forEach', 'forEach', getSetBase, operateDraft, shouldBeEqual);
