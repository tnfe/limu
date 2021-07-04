import { runSetTestSuit, getSetBase, shouldBeEqual } from '../_util';

function operateDraft(setDraft: Set<any>) {
  const values = setDraft.values();
  expect(values).toBeTruthy();
}

runSetTestSuit('test set values', 'values', getSetBase, operateDraft, shouldBeEqual);
