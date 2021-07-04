import { runMapTestSuit, getMapBase, shouldBeEqual } from '../_util';

function operateDraft(mapDraft: Map<any, any>) {
  const ret = mapDraft.get('k1');
  expect(ret === 1).toBeTruthy();
}

runMapTestSuit('test map get', 'get', getMapBase, operateDraft, shouldBeEqual);
