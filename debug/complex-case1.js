const { createDraft, finishDraft } = require('./_util');

const base = {
  numArr: [1, 2, 3, 4],
  mixArr: [
    1,
    { a: 1, b: { c: [1, 2, 3] } },
    new Map([
      ['name', { addr: 'bj' }],
    ]),
    new Set([1, 2, 3, 4]),
  ],
  mixMap: new Map([
    ['key1', { addr: 'bj' }],
    ['key2', 2],
  ]),
  obj1: { desc: 'i am obj 1' },
  obj2: { desc: 'i am obj 2' },
};
const draft = createDraft(base);
draft.mixArr.push(5);
draft.mixArr[0] = 100;
// @ts-ignore
draft.mixArr[2].get('name').addr = 'sz';
const final = finishDraft(draft);

console.log(final.mixArr[2].get('name'));// sz
console.log(base.mixArr[2].get('name')); // bj