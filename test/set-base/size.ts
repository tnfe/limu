import { runSetTestSuit, getSetBase, shouldBeEqual } from '../_util';

function operateDraft(setDraft: Set<any>) {
  expect(setDraft.size).toEqual(3);
}

runSetTestSuit('test set size', 'size', getSetBase, operateDraft, shouldBeEqual);
