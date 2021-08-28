import { runObjectTestSuit } from '../_util';

function getStateBase() {
  return {
    list: [
      { id: 1, name: '111' },
      { id: 2, name: '222' },
      { id: 3, name: '333' },
      { id: 4, name: '444' },
    ],
  };
}

let i = 1;
function getI() {
  return i++;
}
getI()

function changeDraft(objDraft: Record<string, any>) {
  objDraft.list[0].name = 'new_name_' + getI();

  objDraft.list.forEach((item, i) => {
    if (i !== 0 && i !== 3) {
      console.log(item.id);
      item.name = 'xxx';
      item.id = 888;
    }
  });
}

function compare(objNew, objBase) {
  expect(objNew !== objBase).toBeTruthy();
  expect(objNew.list[0] !== objBase.list[0]).toBeTruthy();
  expect(objNew.list[1] !== objBase.list[1]).toBeTruthy();
  expect(objNew.list[2] !== objBase.list[2]).toBeTruthy();
  expect(objNew.list[3] === objBase.list[3]).toBeTruthy();
}

runObjectTestSuit('test object-list', 'list', getStateBase, changeDraft, compare);
