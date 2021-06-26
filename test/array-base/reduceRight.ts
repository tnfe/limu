import { getArrBase, runTestSuit, shouldBeEqual } from '../_util';

function changeDraft(arrDraft: any[]) {
  const map = arrDraft.reduceRight((map, item) => {
    map[item] = item;
    return map;
  }, {});
  expect(map).toMatchObject({ 3: 3, 2: 2, 1: 1 });
}

runTestSuit('test reduceRight', 'reduceRight', getArrBase, changeDraft, shouldBeEqual);
