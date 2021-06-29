import { runMapTestSuit, getMapBase } from '../_util';

function changeDraft(mapDraft: Map<any, any>) {
  const ret = mapDraft.delete('k1');
  expect(ret).toEqual(true);
}

function compare(mapNew, mapBase) {
  expect(mapNew !== mapBase).toBeTruthy();
  expect(mapNew.size).toEqual(2);
  expect(mapBase.size).toEqual(3);
}

runMapTestSuit('test map delete', 'delete', getMapBase, changeDraft, compare);
