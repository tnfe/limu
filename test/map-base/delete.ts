import { getMapBase, runMapTestSuit, runTestSuit } from '../_util';

function changeDraft(mapDraft: Map<any, any>) {
  const ret = mapDraft.delete('k1');
  expect(ret).toEqual(true);
}

function compare(mapNew, mapBase) {
  expect(mapNew !== mapBase).toBeTruthy();
  expect(mapNew.size).toEqual(2);
  expect(mapBase.size).toEqual(3);
}

runMapTestSuit('map is base', 'delete', getMapBase, changeDraft, compare);

runTestSuit(
  'map in base obj',
  'delete',
  () => {
    // get base state
    return { map: getMapBase() };
  },
  (draft) => {
    // change draft
    changeDraft(draft.map);
  },
  (final, base) => {
    // assert
    expect(final !== base).toBeTruthy();
    compare(final.map, base.map);
  },
);
