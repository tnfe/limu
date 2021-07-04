import { runMapTestSuit, getMapBase, shouldBeEqual } from '../_util';

function operateDraft(mapDraft: Map<any, any>) {
  const ret = mapDraft.has('k1');
  expect(ret).toBeTruthy();
}

runMapTestSuit('test map has', 'has', getMapBase, operateDraft, shouldBeEqual);
