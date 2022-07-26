const immer = require('immer');
const limu = require('limu');

immer.setAutoFreeze(false);
limu.setAutoFreeze(false);

function getBase() {
  const base = {
    a: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a1: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a2: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a3: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a4: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a5: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a6: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a7: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a8: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a9: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a10: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a11: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a12: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    arr: [1, 2, 3],
    b: null,
  };
  return base;
};

function die(label) {
  throw new Error(label);
};

function oneBenchmark(lib, base) {
  const start = Date.now();
  const draft = lib.createDraft(base);
  draft.a.b.c.d.e.f.g = 999;
  draft.arr[1] = 100;
  const final = lib.finishDraft(draft);
  if (final === base) {
    die('should not be equal');
  }
  if (final.arr[1] !== 100) {
    die('final.arr[1] !== 100');
  }
  if (base.arr[1] !== 2) {
    die('base.arr[1] !== 1');
  }

  const draft2 = lib.createDraft(base);
  delete draft2.b;
  const final2 = lib.finishDraft(draft2);
  if (final2 === base) {
    die('should not be equal');
  }
  if (base.b !== null) {
    die('base.b should be null');
  }
  if (final2.b !== undefined) {
    die('final2.b should be undefined');
  }

  const taskSpend = Date.now() - start;
  return taskSpend;
}


function measureBenchmark(label, loopLimit) {
  const immutLibs = { limu, immer };
  const lib = immutLibs[label];

  console.log(` ------------- ${label} benchmark ------------- `);
  const base = getBase();
  let totalSpend = 0;
  for (let i = 0; i < loopLimit; i++) {
    totalSpend += oneBenchmark(lib, base);
  }
  console.log(`${label} avg spend ${totalSpend / loopLimit} ms \n`);
}

const loopLimit = 1;
measureBenchmark('limu', loopLimit);
measureBenchmark('immer', loopLimit);
