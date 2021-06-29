import { runMapTestSuit, getMapBase } from '../_util';

function changeDraft(mapDraft: Map<any, any>) {
  mapDraft.set('k4', 4);
  expect(mapDraft.size).toEqual(4);
}

function compare(mapNew, mapBase) {
  expect(mapNew !== mapBase).toBeTruthy();
  expect(mapNew.size).toEqual(4);
  expect(mapBase.size).toEqual(3);
}

runMapTestSuit('test map set', 'set', getMapBase, changeDraft, compare);

