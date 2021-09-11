const { createDraft, finishDraft } = require('./_util');

const base = { arr: [1, 2, 3] };
const draft = createDraft(base);
delete draft.arr[0];
console.log(draft.arr);
console.log(JSON.stringify(draft.arr, null, 2));
const final = finishDraft(draft);
console.log(base === final);
console.log('base.arr ', base.arr);
console.log('final.arr ', final.arr);
