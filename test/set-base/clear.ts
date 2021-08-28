import { runSetTestSuit, getSetBase } from '../_util';

function changeDraft(setDraft: Set<any>) {
  console.log('setDraft.size', setDraft.size);
  setDraft.clear();
  console.log('setDraft.size', setDraft.size);
  expect(setDraft.size).toEqual(0);
}

function compare(setNew, setBase) {
  console.log(setNew.size, setBase.size);
  // expect(setNew !== setBase).toBeTruthy();
  // expect(setNew.size).toEqual(0);
  // expect(setBase.size).toEqual(3);
}

runSetTestSuit('test set clear', 'clear', getSetBase, changeDraft, compare);
