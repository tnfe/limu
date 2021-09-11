import { runTestSuit, getMapBase } from '../_util';

function changeDraft(mapDraft: Map<any, any>) {
  mapDraft.set('k4', 4);
  expect(mapDraft.size).toEqual(4);
}

function compare(mapNew, mapBase) {
  expect(mapNew !== mapBase).toBeTruthy();
  expect(mapNew.size).toEqual(4);
  expect(mapBase.size).toEqual(3);
}

runTestSuit('map is base', 'set', getMapBase, changeDraft, compare);

runTestSuit('map in base obj', 'keys',
  () => { // get base state
    return { map: getMapBase() };
  },
  (draft) => { // change draft
    changeDraft(draft.map);
  },
  (final, base) => { // assert
    expect(final !== base).toBeTruthy();
    compare(final.map, base.map);
  },
);
