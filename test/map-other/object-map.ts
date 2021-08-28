import { runObjectTestSuit, noop } from '../_util';

function getStateBase() {
  const toReturn = {
    map: new Map<string, { name: string, info: any }>([
      ["fancy", { name: "fancy", info: { name: 'ok', addr: 'bj' } }],
      ["hel", { name: "hel-micro", info: { name: 'cool', addr: 'micro front' } }],
    ]),
    count: 1,
  };
  return toReturn;
}

let i = 1;
function getI() {
  return i++;
}
getI()

function changeDraft(objDraft: Record<string, any>) {
  objDraft.count = 3;
  // console.log(objDraft);
  objDraft.map.get('fancy').name = 'fancy_new';
  // help detect: Cannot set property size of #<Map> which has only a getter
  noop('objDraft.map.size', objDraft.map.size);
}

function compare(objNew, objBase) {
  expect(objNew !== objBase).toBeTruthy();
  expect(objNew.map !== objBase.map).toBeTruthy();
  expect(objNew.map.get('fancy') !== objBase.map.get('fancy')).toBeTruthy();
  expect(objNew.map.get('hel') === objBase.map.get('hel')).toBeTruthy();
}

runObjectTestSuit('test object-map', 'map', getStateBase, changeDraft, compare);
