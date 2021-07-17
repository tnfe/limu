import { getArrBase, runTestSuit } from '../_util';

// function operateDraft(arrDraft: any[]) {
//   const arrTmp = arrDraft.map((item, i) => {
//     return item * i;
//   });
//   expect(arrTmp).toMatchObject([0, 2, 6]);
// }

// runTestSuit('test map', 'map', getArrBase, operateDraft, shouldBeEqual);

// 在 map 过程中故意修改 arr 对应下标的值
function changeDraft(arrDraft: any[]) {
  const arrTmp = arrDraft.map((item, i, arr) => {
    arr.push('cool');
    arr[i] = item + 10;
    return item * i;
  });
  expect(arrTmp).toMatchObject([0, 2, 6]);
}

function compare(arrNew, arrBase) {
  console.log('arrNew ', arrNew);
  console.log('arrBase ', arrBase);
  expect(arrNew).toMatchObject([11, 12, 13, 'cool', 'cool', 'cool']);
  expect(arrBase !== arrNew).toBeTruthy();
}

runTestSuit('test map', 'modify item in map process', getArrBase, changeDraft, compare);
