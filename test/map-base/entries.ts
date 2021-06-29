import { runMapTestSuit, getMapBase, shouldBeEqual } from '../_util';

function changeDraft(mapDraft: Map<any, any>) {
  // return MapIterator
  const it = mapDraft.entries();
  expect(it !== null).toBeTruthy();
}

runMapTestSuit('test map entries', 'entries', getMapBase, changeDraft, shouldBeEqual);
