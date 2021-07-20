import { runTestSuit } from '../_util';


function getObjectItemArr() {
  return [
    { name: 'cool' },
    { name: 'cool2' },
  ];
}

function changeDraftObjectItem(arrDraft: any[]) {
  arrDraft.forEach((item) => {
    item.name = 'new_' + Date.now();
  });
}

function compareObjectItemArr(arrNew, arrBase) {
  expect(arrNew !== arrBase).toBeTruthy();
}

runTestSuit('test array forEach', 'update object item', getObjectItemArr, changeDraftObjectItem, compareObjectItemArr);
