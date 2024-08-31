import { runTestSuit } from '../_util';

function getArrBase() {
  return [
    { id: 1, name: '111' },
    { id: 2, name: '222' },
  ];
}

function changeDraft(arrDraft: any[]) {
  for (const item of arrDraft) {
    item.name = 'new_name';
  }
}

function compare(arrNew, arrBase) {
  expect(arrNew !== arrBase).toBeTruthy();
  expect(arrNew[0].name === 'new_name').toBeTruthy();
  expect(arrNew[1].name === 'new_name').toBeTruthy();
  expect(arrBase[0].name === '111').toBeTruthy();
  expect(arrBase[1].name === '222').toBeTruthy();
}

runTestSuit('test for-of', 'change all items', getArrBase, changeDraft, compare);
