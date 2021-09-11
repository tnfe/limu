import { runTestSuit, getSetBase } from '../_util';

function changeDraft(setDraft: Set<any>) {
  setDraft.clear();
  expect(setDraft.size).toEqual(0);
}

function compare(setNew, setBase) {
  expect(setNew !== setBase).toBeTruthy();
  expect(setNew.size).toEqual(0);
  expect(setBase.size).toEqual(3);
}

runTestSuit('set is base', 'clear', getSetBase, changeDraft, compare);

runTestSuit('set in base obj', 'clear',
  () => { // get base state
    return { set: getSetBase() };
  },
  (draft) => { // change draft
    changeDraft(draft.set);
  },
  (final, base) => { // assert
    expect(final !== base).toBeTruthy();
    compare(final.set, base.set);
  },
);
