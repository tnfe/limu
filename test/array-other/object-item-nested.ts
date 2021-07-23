import { runTestSuit } from '../_util';

function getArrBase() {
  return [
    { id: 1, a: { b: [{ b1: [{ c1: 1 }] }], b_rest: { r1: 1 } }, rest: { r1: 1 } },
    { id: 2, a: { b: [{ b1: [{ c1: 1 }] }], b_rest: { r1: 1 } }, rest: { r1: 1 } },
  ];
}

function changeDraft(arrDraft: any[]) {
  arrDraft[0].a.b[0].b1[0].c1 = 2;
}

function compare(arrNew, arrBase) {
  expect(arrNew === arrBase).toBeFalsy();
  expect(arrNew[0] === arrBase[0]).toBeFalsy();
  expect(arrNew[0].a === arrBase[0].a).toBeFalsy();
  expect(arrNew[0].a.b === arrBase[0].a.b).toBeFalsy();
  expect(arrNew[0].a.b_rest === arrBase[0].a.b_rest).toBeTruthy();
  expect(arrNew[0].rest === arrBase[0].rest).toBeTruthy();
  expect(arrNew[1] === arrBase[1]).toBeTruthy();
}

runTestSuit('test object-item-nested', 'nested item', getArrBase, changeDraft, compare);
