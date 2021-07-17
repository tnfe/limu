import { runSetTestSuit, getSetObjBase, noop } from '../_util';
// import { runSetTestSuit, getSetObjBase } from '../_util';

function changeDraft(setDraft: Set<any>) {
  setDraft.forEach((item) => {
    if (item.name === 'k1') item.name = 'new_k1';
  });
}

function compare(setNew, setBase) {
  expect(setNew !== setBase).toBeTruthy();
}

runSetTestSuit('set update-object-item', 'update', getSetObjBase, changeDraft, compare);

function changeDraft2(setDraft: Set<any>) {
  setDraft.forEach((item) => {
    noop(item);
  });
}

function compare2(setNew, setBase) {
  expect(setNew === setBase).toBeTruthy();
}

runSetTestSuit('set update-object-item', 'no update', getSetObjBase, changeDraft2, compare2);
