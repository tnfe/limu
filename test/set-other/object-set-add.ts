// @ts-nocheck
import { runObjectTestSuit } from '../_util';

function getStateBase() {
  const toReturn = {
    set: new Set([1, { name: 'ha' }, 3]),
    count: 1,
  };
  return toReturn;
}

type Obj = { set: Set<any>; count: number };

function changeDraft(objDraft: Obj) {
  objDraft.count = 3;

  objDraft.set.forEach((v, v2, set) => {
    if (v === 3) {
      set.add('k4');
    }
  });

  objDraft.set.add('444');
  expect(objDraft.set.has(1)).toBeTruthy();
  expect(objDraft.set.has(3)).toBeTruthy();
  expect(objDraft.set.has('k4')).toBeTruthy();
  expect(objDraft.set.has('444')).toBeTruthy();
  expect(objDraft.set.size === 5).toBeTruthy();
}

function compare(final: Obj, base: Obj) {
  expect(final !== base).toBeTruthy();
  expect(final.set !== base.set).toBeTruthy();
  const finalArr = Array.from(final.set);
  const baseArr = Array.from(base.set);

  expect(finalArr.includes(1)).toBeTruthy();
  expect(finalArr.includes(3)).toBeTruthy();
  expect(finalArr.includes('k4')).toBeTruthy();
  expect(finalArr.includes('444')).toBeTruthy();
  expect(finalArr.length === 5).toBeTruthy();
  expect(baseArr[3] === undefined).toBeTruthy();

  expect(final.set.has(1)).toBeTruthy();
  expect(final.set.has(3)).toBeTruthy();
  expect(final.set.has('k4')).toBeTruthy();
  expect(final.set.has('444')).toBeTruthy();
  expect(final.set.size === 5).toBeTruthy();

  // set order is not granted, immer also fail at below sentence
  // expect(finalArr[0] === baseArr[0]).toBeTruthy();
  // expect(finalArr[1] === baseArr[1]).toBeTruthy();
  // expect(finalArr[2] === baseArr[2]).toBeTruthy();
  // expect(finalArr[3] === 444).toBeTruthy();
}

runObjectTestSuit('test object-set-add', 'add', getStateBase, changeDraft, compare);
