import { getArrBase, runTestSuit } from '../_util';

function changeDraft(arrDraft) {
  arrDraft.unshift(0);
}

function compare(arrNew, arrBase) {
  console.log(arrNew);
  console.log(arrBase);
  const len = arrNew.length;
  console.log('---> len is ', len);
  console.log('---> arrNew.length ', len === 4, arrBase);
  console.log('---> typeof arrNew.length ', typeof len);
  expect(len === 4).toBeTruthy();
  // expect(arrNew !== arrBase).toBeTruthy();
}

runTestSuit('arr is base', 'unshift', getArrBase, changeDraft, compare);

// runTestSuit('arr in base obj', 'unshift',
//   () => { // get base state
//     return { arr: getArrBase() };
//   },
//   (draft) => { // change draft
//     changeDraft(draft.arr);
//   },
//   (final, base) => { // assert
//     expect(final !== base).toBeTruthy();
//     compare(final.arr, base.arr);
//   },
// );
