import { runSetTestSuit, getSetBase } from '../_util';

function changeDraft(setDraft: Set<any>) {
  setDraft.clear();
  expect(setDraft.size).toEqual(0);
}

function compare(setNew, setBase) {
  expect(setNew !== setBase).toBeTruthy();
  expect(setNew.size).toEqual(0);
  expect(setBase.size).toEqual(3);
}

runSetTestSuit('test set clear', 'clear', getSetBase, changeDraft, compare);
