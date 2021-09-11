const { createDraft, finishDraft } = require('./_util');

const base = new Set([{ key: 'old1' }, { key: 'old2' }]);
const draft = createDraft(base);

draft.forEach(item => {
  item.key = 'new';
});
const final = finishDraft(draft);
console.log(base === final);

console.log('base ', base);
console.log('final ', final);
