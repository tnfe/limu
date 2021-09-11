const { createDraft, finishDraft } = require('./_util');

const base = { a: { b: { c: 1 } }, b: null, c: [1, 2, 3] };
var draft2 = createDraft(base);
draft2.c.push(1000);
const final2 = finishDraft(draft2);

console.log(final2.c !== base.c);
