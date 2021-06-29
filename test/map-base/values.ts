import { runMapTestSuit, getMapBase, shouldBeEqual } from '../_util';

function changeDraft(mapDraft: Map<any, any>) {
  // return MapIterator
  const it = mapDraft.values();
  expect(it !== null).toBeTruthy();
}

runMapTestSuit('test map values', 'values', getMapBase, changeDraft, shouldBeEqual);
