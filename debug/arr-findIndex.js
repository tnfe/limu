const { createDraft, finishDraft } = require('./_util');

const base = { arr: [1, 2, 3] };
const draft = createDraft(base);
const result = draft.arr.findIndex(item => item === 1);
console.log(result === 0);
const final = finishDraft(draft);
console.log(base === final);
