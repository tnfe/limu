// @ts-nocheck
import { runTestSuit, getSetBase, logStr } from '../_util';

function changeDraft(setDraft: Set<any>) {
  setDraft.forEach((v, v2, set) => {
    if (v === 3) {
      set.add('k4');
    }
  });

  setDraft.add('k5');
  expect(setDraft.size).toEqual(5);
}

function compare(setNew, setBase) {
  expect(setNew !== setBase).toBeTruthy();
  logStr(Array.from(setNew));
  logStr(Array.from(setBase));

  expect(setNew.size).toEqual(5);
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
