import { runTestSuit, getMapBase, shouldBeEqual } from '../_util';

function operateDraft(mapDraft: Map<any, any>) {
  const ret = mapDraft.get('k1');
  expect(ret === 1).toBeTruthy();
}

runTestSuit('map is base', 'get', getMapBase, operateDraft, shouldBeEqual);

runTestSuit('map in base obj', 'get',
  () => { // get base state
    return { map: getMapBase() };
  },
  (draft) => { // change draft
    operateDraft(draft.map);
  },
  (final, base) => { // assert
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.map, base.map);
  },
);
