import { getMapBase, noop, runMapTestSuit, shouldBeEqual } from '../_util';

function changeDraft(mapDraft) {
  noop(mapDraft);
}

runMapTestSuit('test nothing', 'nothing', getMapBase, changeDraft, shouldBeEqual);
