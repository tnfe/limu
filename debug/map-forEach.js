const { createDraft, finishDraft } = require('./_util');

const base = new Map([
  ['k1', 1],
  ['k2', 2],
  ['k3', 3],
]);
const draft = createDraft(base);
console.log('before draft ', draft.get('k1'));

draft.forEach((val, key, map) => {
  // console.log('map ', map);
  map.set(key, `new_${val}`);
  // draft.set(key, `new_${val}`);
});
console.log('base ', JSON.stringify(base));
console.log('draft ', JSON.stringify(draft));
const final = finishDraft(draft);
console.log(base === final);
console.log('base ', base);

const immerFinalStr = `
Map(3) {
  'k1' => 'new_1',
  'k2' => 'new_2',
  'k3' => 'new_3',
  delete: [Function: dontMutateFrozenCollections],
  clear: [Function: dontMutateFrozenCollections],
  add: [Function: dontMutateFrozenCollections],
  set: [Function: dontMutateFrozenCollections]
}
`
console.log('final ', final);
