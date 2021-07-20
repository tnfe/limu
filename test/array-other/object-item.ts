import { runTestSuit } from '../_util';
import { isDraft } from '../../src';

function getArrBase() {
  return [
    { id: 1, name: '111' },
    { id: 2, name: '222' },
  ];
}

function changeDraft(arrDraft: any[]) {
  console.log('start operate draft');
  console.log('arrDraft is draft ', isDraft(arrDraft));
  arrDraft[0].name = 'new_name';
}

function compare(arrNew) {
  // expect(arrNew !== arrBase).toBeTruthy();
  // expect(arrNew[1] === arrBase[1]).toBeTruthy();
  // console.log('arrNew[0].name ', arrNew[0].name);
  expect(arrNew[0].name === 'new_name').toBeTruthy();
  // expect(arrBase[0].name === '111').toBeTruthy();
}

runTestSuit('test object-item', 'item', getArrBase, changeDraft, compare);
