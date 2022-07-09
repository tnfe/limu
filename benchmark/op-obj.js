/**
 * before run this benchmark case you should mark sure execute npm command 'npm run install' in dir benchmark
 */
const immer = require('immer');
const limu = require('limu');

immer.setAutoFreeze(false);

function getBase() {
  return { a: { b: { c: 1 } }, b: null, c: [1, 2, 3], d: { d1: { d2: { d3: { d4: { d5: { d6: 1 } } } } } } };
};

function oneBenchmark(/** @type {import('immer')} */lib, /** @type {ReturnType<typeof getBase>} */base) {
  const start = Date.now();
  for (let i = 0; i < 10000; i++) {
    const draft = lib.createDraft(base);
    draft.a.b.c = 999;
    draft.d.d1.d2.d3.d4.d5.d6 = 1000;
    const d6Val = draft.d.d1.d2.d3.d4.d5.d6;
    if (d6Val !== 1000) {
      throw new Error(`draft.d.d1.d2.d3.d4.d5.d6 should be 1000, now it is ${d6Val}`);
    }
    if (base.d.d1.d2.d3.d4.d5.d6 !== 1) {
      throw new Error('draft.d.d1.d2.d3.d4.d5.d6 should be 1');
    }
    draft.d.d1.d2 = 888;
    if (draft.d.d1.d2 !== 888) {
      throw new Error('draft.d.d1.d2 should be 888');
    }
    if (base.d.d1.d2.d3.d4.d5.d6 !== 1) {
      throw new Error('draft.d.d1.d2.d3.d4.d5.d6 should be 1');
    }

    const final = lib.finishDraft(draft);

    if (final === base) {
      throw new Error('should not be equal');
    }
    if (final.c !== base.c) {
      throw new Error('should be equal');
    }

    if (final === base) {
      throw new Error('should not be equal');
    }
    if (final.d === base.d) {
      throw new Error('should not be equal');
    }

    const draft2 = lib.createDraft(base);
    draft2.a.b.c = 1000;
    delete draft2.b;
    draft2.c.push(1000);
    draft2.c.pop();
    const final2 = lib.finishDraft(draft2);
    if (final2 === base) {
      throw new Error('should not be equal');
    }
    if (final2.c === base.c) {
      throw new Error('c arr should not be equal');
    }
  }

  console.log(`spend ${Date.now() - start} ms`);
}

console.log(' ------------- immer benchmark ------------- ');
const base1 = getBase();
for (let i = 0; i < 10; i++) {
  oneBenchmark(immer, base1);
}

// immer 和 limu 不能共用一个base，在未关闭 immer autoFreeze 功能的情况下
// 否则会导致 #<Object> is not extensible 错误，因为 immer 会冻结对象
console.log('\n ------------- limu benchmark ------------- ');
const base2 = getBase();
for (let i = 0; i < 10; i++) {
  oneBenchmark(limu, base2);
}