import { runSetTestSuit, getSetBase, shouldBeEqual } from '../_util';

function changeDraft(setDraft: Set<any>) {
  const ret = setDraft.entries();
  expect(ret).toBeTruthy();
}

runSetTestSuit('test set entries', 'entries', getSetBase, changeDraft, shouldBeEqual);
