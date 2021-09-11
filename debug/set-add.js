const { createDraft, finishDraft } = require('./_util');

const base = new Set([{ key: 'old1' }, { key: 'old2' }]);
const draft = createDraft(base);
draft.add('k4');
const final = finishDraft(draft);
console.log(Array.from(base));
console.log(Array.from(final));
