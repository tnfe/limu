import { runTestSuit, getSetBase, shouldBeEqual, noop } from '../_util';

function noopDraft(setDraft: Set<any>) {
  setDraft.forEach(item => noop(item));
}

runTestSuit('set is base', 'forEach', getSetBase, noopDraft, shouldBeEqual);

runTestSuit('set in base obj', 'forEach',
  () => { // get base state
    return { set: getSetBase() };
  },
  (draft) => { // change draft
    noopDraft(draft.set);
  },
  (final, base) => { // assert
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.set, base.set);
  },
);

function getObiItemSet() {
  return new Set([{ key: 'old1' }, { key: 'old2' }]);
}

function changeWithDraft(setDraft: Set<any>) {
  setDraft.forEach(item => {
    item.key = 'new';
  });
}

function changeWithCbDraft(setDraft: Set<any>) {
  let i = 0;
  setDraft.forEach((item, item2, set) => {
    noop(item, item2);
    const arr = Array.from(set);
    const itemOfArr = arr[i];
    itemOfArr.key = 'new';
    i++
  });
}

function compare(final: Set<any>, base: Set<any>) {
  final.forEach(item => {
    expect(item.key.includes('new')).toBeTruthy();
  });
  base.forEach(item => {
    expect(item.key.includes('old')).toBeTruthy();
  });
}

runTestSuit('set is base', 'changeWithDraft', getObiItemSet, changeWithDraft, compare);

runTestSuit('set in base obj', 'changeWithDraft',
  () => { // get base state
    return { set: getObiItemSet() };
  },
  (draft) => { // change draft
    changeWithDraft(draft.set);
  },
  (final, base) => { // assert
    expect(final !== base).toBeTruthy();
    compare(final.set, base.set);
  },
);

runTestSuit('set is base', 'changeWithCbDraft', getObiItemSet, changeWithCbDraft, compare);

runTestSuit('set in base obj', 'changeWithCbDraft',
  () => { // get base state
    return { set: getObiItemSet() };
  },
  (draft) => { // change draft
    changeWithCbDraft(draft.set);
  },
  (final, base) => { // assert
    expect(final !== base).toBeTruthy();
    compare(final.set, base.set);
  },
);
