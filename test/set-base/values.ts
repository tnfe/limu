import { runTestSuit, getSetBase, shouldBeEqual } from '../_util';

function operateDraft(setDraft: Set<any>) {
  const values = setDraft.values();
  expect(values).toBeTruthy();
}

runTestSuit('set is base', 'values', getSetBase, operateDraft, shouldBeEqual);

runTestSuit('set in base obj', 'values',
  () => { // get base state
    return { set: getSetBase() };
  },
  (draft) => { // change draft
    operateDraft(draft.set);
  },
  (final, base) => { // assert
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.set, base.set);
  },
);
