/**
 * before run this benchmark case you should mark sure execute npm command 'npm run install' in dir benchmark
 */
const immer = require('immer');
const limu = require('limu');

immer.setAutoFreeze(false);

function getBase() {
  const base = { a: { b: { c: 1 } }, b: null, c: [1, 2, 3] };
  return base;
};


function oneBenchmark(lib, base) {
  const start = Date.now();
  for (let i = 0; i < 10000; i++) {
    const draft = lib.createDraft(base);
    draft.a.b.c = 999;
    if (draft.a.b.c !== 999) {
      throw new Error('draft.a.b.c should equal to 999');
    }
    const final = lib.finishDraft(draft);
    if (final === base) {
      throw new Error('should not be equal');
    }
    if (final.c !== base.c) {
      throw new Error('should be equal');
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

console.log('\n ------------- limu benchmark ------------- ');
const base2 = getBase();
for (let i = 0; i < 10; i++) {
  oneBenchmark(limu, base2);
}
