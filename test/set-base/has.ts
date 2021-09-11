import { runTestSuit, getSetBase, shouldBeEqual } from '../_util';

function operateDraft(setDraft: Set<any>) {
  const ret = setDraft.has(1);
  expect(ret).toBeTruthy();
}

runTestSuit('set is base', 'has', getSetBase, operateDraft, shouldBeEqual);

runTestSuit('set in base obj', 'has',
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
