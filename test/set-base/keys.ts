import { runSetTestSuit, getSetBase, shouldBeEqual } from '../_util';

function operateDraft(setDraft: Set<any>) {
  const ret = setDraft.keys();
  expect(ret).toBeTruthy();
}

runSetTestSuit('test set keys', 'keys', getSetBase, operateDraft, shouldBeEqual);
