import { runTestSuit } from '../_util';

function getArrBase() {
  return [
    { id: 1, name: '111' },
    { id: 2, name: '222' },
  ];
}

function changeDraft(arrDraft: any[]) {
  arrDraft[0].name = 'new_name';
}

function compare(arrNew, arrBase) {
  expect(arrNew !== arrBase).toBeTruthy();
  expect(arrNew[1] === arrBase[1]).toBeTruthy();
  expect(arrNew[0].name === 'new_name').toBeTruthy();
  expect(arrBase[0].name === '111').toBeTruthy();
}

runTestSuit('test object-item', 'change one item', getArrBase, changeDraft, compare);
