import { getArrBase, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(arrDraft) {
  const map = arrDraft.reduce((map, item) => {
    map[item] = item;
    return map;
  }, {});
  expect(map).toMatchObject({ 1: 1, 2: 2, 3: 3 });
}

runTestSuit('test reduce', 'reduce', getArrBase, changeDraft, shouldBeEqual);
