import { runSetTestSuit, getSetBase } from '../_util';

function changeDraft(setDraft: Set<any>) {
  setDraft.add('k4');
  expect(setDraft.size).toEqual(4);
}

function compare(setNew, setBase) {
  expect(setNew !== setBase).toBeTruthy();
  expect(setNew.size).toEqual(4);
  expect(setBase.size).toEqual(3);
}

runSetTestSuit('test set add', 'add', getSetBase, changeDraft, compare);
