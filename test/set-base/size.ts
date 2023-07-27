import { getSetBase, runTestSuit, shouldBeEqual } from '../_util';

function operateDraft(setDraft: Set<any>) {
  expect(setDraft.size).toEqual(3);
}

runTestSuit('set is base', 'size', getSetBase, operateDraft, shouldBeEqual);

runTestSuit(
  'set in base obj',
  'size',
  () => {
    // get base state
    return { set: getSetBase() };
  },
  (draft) => {
    // change draft
    operateDraft(draft.set);
  },
  (final, base) => {
    // assert
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.set, base.set);
  },
);
