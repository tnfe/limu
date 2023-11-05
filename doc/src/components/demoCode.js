/* eslint-disable no-multiple-empty-lines */

export const produce = `
import * as limu from 'limu';
// ---------------- 以下代码可复制到console运行（window全局已绑定limu对象）----------------

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
import * as limu from 'limu';
// ---------------- 以下代码可复制到console运行（window全局已绑定limu对象）----------------

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

export const immut = `
import * as limu from 'limu';
// ---------------- 以下代码可复制到console运行（window全局已绑定limu对象）----------------

// immut 对base生成一个不可修改的对象im，但base的修改将同步会影响到im，并始终和 base 保持结构共享
const { immut } = limu;
// 场景1：直接修改base
const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const im = immut(base);

im.a = 100; // 修改无效
base.a = 100; // 修改会影响 im

// 场景2：合并 next 到base
const base2 = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const im = immut(base2, { onOperate: console.log }); // 配置读写监听
const draft = createDraft(base);
draft.d.d1 = 100; // 做深层次的修改

console.log(im.d.d1); // log 1，保持不变，同时触发 onOperate 回调
const next = finishDraft(draft);
Object.assign(base, next);
console.log(im.d.d1); // 100，im和base始终保持数据同步

`;

export const onOperate = `
import * as limu from 'limu';
// ---------------- 以下代码可复制到console运行（window全局已绑定limu对象）----------------

// 基于 onOperate 可监听所有数据变更流程，produce/createDraft 均支持
// produce(base, draftCb, { onOperate })
// createDraft(base, { onOperate });

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

export const benchmark = `
// 更多性能测试见 https://github.com/tnfe/limu/tree/main/benchmark

function oneCase(produce) {
  const demo = { info: Array.from(Array(10000).keys()) };
  produce(demo, (draft) => {
    draft.info[2000] = 0;
  });
}

function runBenchmark(produce, label) {
  const start = Date.now();
  const limit = 100;
  for (let i = 0; i < limit; i++) {
    oneCase(produce);
  }
  console.log(\`\${label} avg spend \${(Date.now() - start) / limit} ms\`);
}

function run() {
  immer.setAutoFreeze(false);
  runBenchmark(immer.produce, 'immer with autoFreeze=false,');
  immer.setAutoFreeze(true);
  runBenchmark(immer.produce,'immer with autoFreeze=true,');

  limu.setAutoFreeze(false);
  runBenchmark(limu.produce, 'limu with autoFreeze=false,');
  limu.setAutoFreeze(true);
  runBenchmark(limu.produce, 'limu with autoFreeze=true,');
}

run();
`;

export default [
  { key: 'produce', content: produce },
  { key: 'createDraft', content: createDraft },
  { key: 'immut', content: immut },
  { key: 'onOperate', content: onOperate },
  { key: 'benchmark', content: benchmark },
];
