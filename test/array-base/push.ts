import { getArrBase, runTestSuit } from '../_util';

function changeDraft(arrDraft) {
  arrDraft.push(4);
}

function compare(arrNew, arrBase) {
  console.log('arrNew ', arrNew, arrNew.length);
  console.log('arrBase ', arrBase);
  expect(arrBase.length === 3).toBeTruthy();
  expect(arrNew.length === 4).toBeTruthy();
  expect(arrNew !== arrBase).toBeTruthy();
}

runTestSuit('arr is base', 'push', getArrBase, changeDraft, compare);

// runTestSuit('arr in base obj', 'push',
//   function getArrBase() {
//     return { arr: [1, 2, 3, 4] };
//   },
//   function changeDraft(draft) {
//     draft.arr.push(1000);
//   },
//   function compare(draft, base) {
//     expect(draft.arr.length === 5).toBeTruthy();
//     expect(base.arr.length === 4).toBeTruthy();
//   },
// );
