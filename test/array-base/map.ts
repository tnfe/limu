import { getArrBase, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const arrTmp = arrDraft.map((item, i) => {
    return item * i;
  });
  expect(arrTmp).toMatchObject([0, 2, 6]);
}

runTestSuit('test map', 'map', getArrBase, changeDraft, shouldBeEqual);
