import { noop, runObjectTestSuit } from '../_util';

function getStateBase() {
  const toReturn = {
    set: new Set([{ name: 'k1' }, { name: 'k2' }, { name: 'k3' }]),
    count: 1,
  };
  return toReturn;
}

type Obj = { set: Set<{ name: string }>; count: number };

function changeDraft(objDraft: Obj) {
  objDraft.count = 3;
  objDraft.set.forEach((item) => {
    if (item.name === 'k1') {
      item.name = 'kkk1';
    }
  });
  noop('see if error occurred', objDraft.set.size);
}

function compare(final: Obj, base: Obj) {
  expect(final !== base).toBeTruthy();
  expect(final.set !== base.set).toBeTruthy();
  const arr1 = Array.from(final.set);
  const arr2 = Array.from(base.set);
  expect(arr1[0] !== arr2[0]).toBeTruthy();
  expect(arr1[1] === arr2[1]).toBeTruthy();
  expect(arr1[2] === arr2[2]).toBeTruthy();
}

runObjectTestSuit('test object-set', 'set', getStateBase, changeDraft, compare);
