import { runSetTestSuit, getSetBase } from '../_util';

function changeDraft(setDraft: Set<any>) {
  setDraft.delete(1);
  expect(setDraft.size).toEqual(2);
}

function compare(setNew, setBase) {
  expect(setNew !== setBase).toBeTruthy();
  expect(setNew.size).toEqual(2);
  expect(setBase.size).toEqual(3);
}

runSetTestSuit('test set delete', 'delete', getSetBase, changeDraft, compare);
