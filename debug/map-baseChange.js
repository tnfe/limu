/**
 * 对应 test/map-other/case1.ts
 */
const { createDraft, finishDraft } = require('./_util');

const base = new Map([
  ["michel", { name: "Michel Weststrate", country: "NL" }],
]);
const draft = createDraft(base);
draft.get("michel").country = "UK";
const final = finishDraft(draft);

console.log(base);

console.log(final);
