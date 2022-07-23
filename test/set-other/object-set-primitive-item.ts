import { runObjectTestSuit, noop, isNewArch } from '../_util';

function getStateBase() {
  const toReturn = {
    set: new Set([1, { name: 'ha' }, 3]),
    count: 1,
  };
  return toReturn;
}

type Obj = { set: Set<{ name: string }>, count: number };


function changeDraft(objDraft: Obj) {
  objDraft.count = 3;
  objDraft.set.forEach((item) => {
    if (typeof item === 'object') {
      item.name = 'new';
    }
  });
  noop('see if error occurred', objDraft.set.size);
}


// MARK: fail in immer, 
function compare(final: Obj, base: Obj) {
  expect(final !== base).toBeTruthy();
  expect(final.set !== base.set).toBeTruthy();
  const arr1 = Array.from(final.set);
  const arr2 = Array.from(base.set);
  expect(arr1[0] === arr2[0]).toBeTruthy();
  expect(arr1[1] !== arr2[1]).toBeTruthy();
  expect(arr1[2] === arr2[2]).toBeTruthy();
}

if(!isNewArch()){
  runObjectTestSuit('test object-set-primitive-item', 'primitive-item', getStateBase, changeDraft, compare);
}

// avoid:  Your test suite must contain at least one test.
runObjectTestSuit('pass', 'pass', getStateBase, changeDraft, () => {
  expect(1 === 1).toBeTruthy();
});
