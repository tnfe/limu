import { runTestSuit, getSetBase } from '../_util';

function changeDraft(setDraft: Set<any>) {
  setDraft.add('k4');
  expect(setDraft.size).toEqual(4);
}

function compare(setNew, setBase) {
  expect(setNew !== setBase).toBeTruthy();
  expect(setNew.size).toEqual(4);
  expect(setBase.size).toEqual(3);
}

runTestSuit('set is base', 'add', getSetBase, changeDraft, compare);

runTestSuit('set in base obj', 'add',
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
