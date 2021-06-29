import { runMapTestSuit, getMapBase } from '../_util';

function changeDraft(mapDraft: Map<any, any>) {
  mapDraft.clear();
  expect(mapDraft.size).toEqual(0);
}

function compare(mapNew, mapBase) {
  expect(mapNew !== mapBase).toBeTruthy();
  expect(mapNew.size).toEqual(0);
  expect(mapBase.size).toEqual(3);
}

runMapTestSuit('test map clear', 'clear', getMapBase, changeDraft, compare);
