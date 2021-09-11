import { runTestSuit, getSetBase } from '../_util';

function changeDraft(setDraft: Set<any>) {
  setDraft.delete(1);
  expect(setDraft.size).toEqual(2);
}

function compare(setNew, setBase) {
  expect(setNew !== setBase).toBeTruthy();
  expect(setNew.size).toEqual(2);
  expect(setBase.size).toEqual(3);
}

runTestSuit('set is base', 'delete', getSetBase, changeDraft, compare);

runTestSuit('set in base obj', 'delete',
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
