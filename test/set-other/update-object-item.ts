import { runSetTestSuit, getSetObjBase } from '../_util';

function changeDraft(setDraft: Set<any>) {
  setDraft.forEach((item, idx) => {
    if (idx === 0) item.name = 'new_k1';
  });
}

function compare(setNew, setBase) {
  expect(setNew !== setBase).toBeTruthy();
  // expect(setNew[0] !== setBase[0]).toBeTruthy();
  // expect(setNew[1] === setBase[1]).toBeTruthy();
  // expect(setNew[2] === setBase[2]).toBeTruthy();
}

runSetTestSuit('set update-object-item', 'update', getSetObjBase, changeDraft, compare);
