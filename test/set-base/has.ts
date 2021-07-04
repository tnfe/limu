import { runSetTestSuit, getSetBase, shouldBeEqual } from '../_util';

function operateDraft(setDraft: Set<any>) {
  const ret = setDraft.has(1);
  expect(ret).toBeTruthy();
}

runSetTestSuit('test set has', 'has', getSetBase, operateDraft, shouldBeEqual);
