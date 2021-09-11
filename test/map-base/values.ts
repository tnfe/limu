import { runTestSuit, getMapBase, shouldBeEqual } from '../_util';

function changeDraft(mapDraft: Map<any, any>) {
  // return MapIterator
  const it = mapDraft.values();
  expect(it !== null).toBeTruthy();
}

runTestSuit('map is base', 'keys', getMapBase, changeDraft, shouldBeEqual);

runTestSuit('map in base obj', 'keys',
  () => { // get base state
    return { map: getMapBase() };
  },
  (draft) => { // change draft
    changeDraft(draft.map);
  },
  (final, base) => { // assert
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.map, base.map);
  },
);
