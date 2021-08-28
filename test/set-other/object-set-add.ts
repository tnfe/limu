import { runObjectTestSuit, noop } from '../_util';

function getStateBase() {
  const toReturn = {
    set: new Set([1, { name: 'ha' }, 3]),
    count: 1,
  };
  return toReturn;
}

type Obj = { set: Set<any>, count: number };

function changeDraft(objDraft: Obj) {
  objDraft.count = 3;
  objDraft.set.add(444);
  noop('see if error occurred', objDraft.set.size);
}

function compare(final: Obj, base: Obj) {
  expect(final !== base).toBeTruthy();
  expect(final.set !== base.set).toBeTruthy();
  const finalArr = Array.from(final.set);
  const baseArr = Array.from(base.set);
  expect(finalArr[0] === baseArr[0]).toBeTruthy();
  expect(finalArr[1] === baseArr[1]).toBeTruthy();
  expect(finalArr[2] === baseArr[2]).toBeTruthy();
  expect(finalArr[3] === 444).toBeTruthy();
  expect(baseArr[3] === undefined).toBeTruthy();
}

runObjectTestSuit('test object-set-add', 'add', getStateBase, changeDraft, compare);
