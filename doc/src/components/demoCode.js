/* eslint-disable no-multiple-empty-lines */

export const produce = `
import * as limu from 'limu';

// 右键打开浏览器控制台，直接粘贴以下代码即可体验此示例（全局已绑定limu对象）
const { produce } = limu;
const baseState = {
  a: 1,
  b: [ 1, 2, 3 ],
  c: {
    c1: { n: 1 },
    c2: { m: 2 },
  }
};
const nextState = produce(baseState, (draft)=>{
  draft.a = 2;
  draft.b['2'] = 100;
});

console.log(nextState === baseState); // false
console.log(nextState.a === baseState.a); // false
console.log(nextState.b === baseState.b); // false
console.log(nextState.c === baseState.c); // true

// Currying call
const producer = produce((draft)=>{
  draft.a = 2;
  draft.b['2'] = 100;
});
const nextState = producer(baseState);
`;

export const createDraft = `
import { createDraft, finishDraft } from 'limu';

// 右键打开浏览器控制台，直接粘贴以下代码即可体验此示例（全局已绑定limu对象）
const { createDraft, finishDraft } = limu;
const base = { a: 1, b: { b1: 1, b2: 2, b3: { b31: 1 } }, c: [1, 2, 3], d: { d1: 1000 }, e: 1000 };
const draft = createDraft(base);
draft.a = 200;
draft.b.b1 = 100;
draft.c.push(4);
delete draft.e;
const final = finishDraft(draft);

console.log(base === final); // false
console.log(base.a === final.a); // false
console.log(base.b === final.b); // false
console.log(base.c === final.c); // false
console.log(base.d === final.d); //true
console.log(base.b.b3 === final.b.b3); // true
console.log(base.e); // 1000
console.log(final.e); // undefined

`;

export const onOperate = `
import * as limu from 'limu';

// 基于 onOperate 可监听所有数据变更流程，produce/createDraft 均支持
// produce(base, draftCb, { onOperate })
// createDraft(base, { onOperate });

// 右键打开浏览器控制台，直接粘贴以下代码即可体验此示例（全局已绑定limu对象）
const { createDraft, finishDraft } = limu;
const base = new Map([
  ['nick', { list: [1,2,3], info: { age: 1, grade: 4, money: 1000 } }],
  ['fancy', { list: [1,2,3,4,5], info: { age: 2, grade: 6, money: 100000000 } }],
  ['anonymous', { list: [1,2], info: { age: 0, grade: 0, money: 0 } }],
]);
const draft = createDraft(base, { onOperate: console.log });
draft.delete('anonymous');
draft.get('fancy').info.money = 200000000;
const final = finishDraft(draft);

console.log('base.anonymous', base.get('anonymous')); // still existed
console.log('final.anonymous', final.get('anonymous')); // undefined
`;


export default {
  produce,
  createDraft,
  onOperate,
};
