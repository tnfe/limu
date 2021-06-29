import { runMapTestSuit, getMapBase, shouldBeEqual } from '../_util';

function changeDraft(mapDraft: Map<any, any>) {
  // return MapIterator
  const it = mapDraft.keys();
  expect(it !== null).toBeTruthy();
}

runMapTestSuit('test map keys', 'keys', getMapBase, changeDraft, shouldBeEqual);
