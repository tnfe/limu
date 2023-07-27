import { getMapBase, runMapTestSuit, runTestSuit } from '../_util';

function changeDraft(mapDraft: Map<any, any>) {
  mapDraft.clear();
  expect(mapDraft.size).toEqual(0);
}

function compare(mapNew, mapBase) {
  expect(mapNew !== mapBase).toBeTruthy();
  expect(mapNew.size).toEqual(0);
  expect(mapBase.size).toEqual(3);
}

runMapTestSuit('map is base', 'clear', getMapBase, changeDraft, compare);

runTestSuit(
  'map in base obj',
  'clear',
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
