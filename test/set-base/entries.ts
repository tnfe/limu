import { runTestSuit, getSetBase, shouldBeEqual } from '../_util';

function changeDraft(setDraft: Set<any>) {
  const ret = setDraft.entries();
  expect(ret).toBeTruthy();
}

runTestSuit('set is base', 'entries', getSetBase, changeDraft, shouldBeEqual);

runTestSuit('set in base obj', 'entries',
  () => { // get base state
    return { set: getSetBase() };
  },
  (draft) => { // change draft
    changeDraft(draft.set);
  },
  (final, base) => { // assert
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.set, base.set);
  },
);
