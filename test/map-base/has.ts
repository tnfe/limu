import { runTestSuit, getMapBase, shouldBeEqual } from '../_util';

function operateDraft(mapDraft: Map<any, any>) {
  const ret = mapDraft.has('k1');
  expect(ret).toBeTruthy();
}

runTestSuit('map is base', 'has', getMapBase, operateDraft, shouldBeEqual);

runTestSuit('map in base obj', 'has',
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
