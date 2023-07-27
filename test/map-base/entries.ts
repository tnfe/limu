import { getMapBase, runMapTestSuit, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(mapDraft: Map<any, any>) {
  // return MapIterator
  const it = mapDraft.entries();
  expect(it !== null).toBeTruthy();
}

runMapTestSuit('map is base', 'entries', getMapBase, changeDraft, shouldBeEqual);

runTestSuit(
  'map in base obj',
  'entries',
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
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.map, base.map);
  },
);
