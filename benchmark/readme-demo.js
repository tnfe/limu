/**
 * before run this benchmark case you should mark sure execute npm command 'npm run install' in dir benchmark
 */
const immer = require('immer');
const limu = require('limu');

// immer.setAutoFreeze(true);
// limu.setAutoFreeze(true);
immer.setAutoFreeze(false);
limu.setAutoFreeze(false);

function getBase() {
  const base = { a: { b: { c: { d: { e: { f: { g: 1 } } } } } }, b: null };
  return base;
};

function oneBenchmark(lib, base) {
  const start = Date.now();
  for (let i = 0; i < 10000; i++) {
    const draft = lib.createDraft(base);
    draft.a.b.c.d.e.f.g = 999;
    const final = lib.finishDraft(draft);
    if (final === base) {
      throw new Error('should not be equal');
    }

    const draft2 = lib.createDraft(base);
    delete draft2.b;
    const final2 = lib.finishDraft(draft2);
    if (final2 === base) {
      throw new Error('should not be equal');
    }
    if (base.b !== null) {
      throw new Error('base.b should be null');
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
