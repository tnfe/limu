const { createDraft, finishDraft } = require('./_util');

// const base = { arr: [3, 1, 2, 4, 4, 5] };
// const draft = createDraft(base);
// const sortedArr = draft.arr.sort();
// console.log('sortedArr', sortedArr);
// console.log('base.arr', base.arr);
// const final = finishDraft(draft);
// console.log(base === final);

const base = [3, 1, 2, 4, 4, 5];
const draft = createDraft(base);
const sortedArr = draft.sort();
console.log('sortedArr', JSON.stringify(sortedArr));
console.log('base.arr', base);
const final = finishDraft(draft);
console.log(base === final);
