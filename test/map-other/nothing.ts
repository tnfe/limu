import { runMapTestSuit, getMapBase, shouldBeEqual, noop } from '../_util';

function changeDraft(mapDraft) {
  noop(mapDraft);
}

runMapTestSuit('test nothing', 'nothing', getMapBase, changeDraft, shouldBeEqual);
