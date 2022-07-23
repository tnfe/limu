const immer = require('immer');
const limu = require('limu');
const util = require('./_util');
const pstr = require('./_pstr');
const none = require('./_none');
const immutLibs = {
  immer,
  limu,
  pstr,
  none, // just to see native js operation perf
};
const loopLimit = 1000;
const strategyConsts = {
  BASE_T_AUTO_T: '1',    // reuseBase: true   autoFreeze: true       
  BASE_F_AUTO_T: '2',    // reuseBase: false  autoFreeze: true       
  BASE_T_AUTO_F: '3',    // reuseBase: true   autoFreeze: false
  BASE_F_AUTO_F: '4',    // reuseBase: false  autoFreeze: false      
};


// ************************************************************************
const curStrategy = process.env.ST || strategyConsts.BASE_F_AUTO_F;
// change params 'hasArr'、'lessDeepOp' to test limu and immer performance in different situations
// then run npm cmd: `npm run s1`、`npm run s2`、`npm run s3`、`npm run s4` to see perf result
const hasArr = true; // operate arr or not
const lessDeepOp = false; // has more deep operation or not
// ************************************************************************
// hasArr = true; lessDeepOp = false; limu close to native

// perf test result at macbook 2021 max pro
const pretReport = `
-----------------------[ hasArr true, lessOp true ]--------------------------
(reuseBase: true,  autoFreeze: true)  immer 2.797 ms : limu 1.287 ms
(reuseBase: false, autoFreeze: true)  immer 2.835 ms : limu 1.313 ms
(reuseBase: true,  autoFreeze: false) immer 2.049 ms : limu 0.089 ms
(reuseBase: false, autoFreeze: false) immer 2.096 ms : limu 0.146 ms

-----------------------[ hasArr true, lessOp false ]--------------------------
(reuseBase: true,  autoFreeze: true)  immer 2.946 ms : limu 1.268 ms
(reuseBase: false, autoFreeze: true)  immer 3.005 ms : limu 1.345 ms
(reuseBase: true,  autoFreeze: false) immer 2.162 ms : limu 0.147 ms
(reuseBase: false, autoFreeze: false) immer 2.169 ms : limu 0.161 ms

-----------------------[ hasArr false, lessOp true ]--------------------------
(reuseBase: true,  autoFreeze: true)  immer 2.253 ms : limu 0.659 ms
(reuseBase: false, autoFreeze: true)  immer 2.261 ms : limu 0.705 ms
(reuseBase: true,  autoFreeze: false) immer 1.386 ms : limu 0.015 ms
(reuseBase: false, autoFreeze: false) immer 1.469 ms : limu 0.017 ms

-----------------------[ hasArr false, lessOp false ]--------------------------
(reuseBase: true,  autoFreeze: true)  immer 2.266 ms : limu 0.604 ms
(reuseBase: false, autoFreeze: true)  immer 2.201 ms : limu 0.643 ms
(reuseBase: true,  autoFreeze: false) immer 1.565 ms : limu 0.055 ms
(reuseBase: false, autoFreeze: false) immer 1.479 ms : limu 0.061 ms
`;


const sc = strategyConsts;
const stategies = {
  [sc.BASE_T_AUTO_T]: [true, true],
  [sc.BASE_F_AUTO_T]: [false, true],
  [sc.BASE_T_AUTO_F]: [true, false],
  [sc.BASE_F_AUTO_F]: [false, false],
};
const reuseBase = stategies[curStrategy][0];
const autoFreeze = stategies[curStrategy][1];
// console.log(`reuseBase ${reuseBase} , autoFreeze ${autoFreeze}`);

immer.setAutoFreeze(autoFreeze);
limu.setAutoFreeze(autoFreeze);

function die(label) {
  throw new Error(label);
};

function getBase() {
  return util.getBaseArr(4, false);
};

function oneBenchmark(lib, reuse, operateArr, lessDeepOp) {
  const base = getBase();
  const targetBase = reuse ? base : getBase();

  // immer has heavy init, so let's skip this init step to see what the result will be
  const draft = lib.createDraft(targetBase);
  const final = lib.finishDraft(draft);

  // stats time from here
  const start = Date.now();
  const d2 = lib.createDraft(final); // final or targetBase
  d2.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z = 666;
  if (!lessDeepOp) {
    d2.a.b.c.d.e.f.g = 999;
    d2.a.b.c.d.e.f = 999;
    d2.a.b.c.d.e = 999;
    d2.a.b.c.d = 999;
    d2.a.b.c = 999;
    d2.a.b = 999;
    d2.a = 999;
    d2.aaa = 999;
    d2.a = 1;
    d2.a1.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
    d2.a2.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
    d2.a3.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
    d2.a4.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
    d2.a5.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
    d2.a6.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
    d2.a7.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
  }

  if (operateArr) {
    const arr = d2.arr;
    // arr.forEach((item, idx) => {
    // this way better
    lib.original(arr).forEach((item, idx) => {
      if (idx > 0 && idx % 6000 === 0) {
        arr[idx].a = 888;
      }
    });
  }
  const f2 = lib.finishDraft(d2);

  if (operateArr && lib.__NATIVE_JS__ !== true) {
    if (f2.arr[6000].a !== 888) {
      die('final.arr[6000]');
    }
    if (base.arr[6000].a !== 1) {
      die('base.arr[6000]');
    }
  }


  if (operateArr) {
    const draft2 = lib.createDraft(targetBase);
    delete draft2.b;
    draft2.arr[1].a = 888;
    draft2.arr.push({ a: 'limu' });
    draft2.arr.push({ a: 'limu' });
    draft2.arr.push({ a: 'limu' });
    draft2.arr.push({ a: 'limu' });
    const final2 = lib.finishDraft(draft2);
    final2.arr[1].a = 666;
  }

  const taskSpend = Date.now() - start;
  // console.log(`spend ${taskSpend} ms`);
  return taskSpend;
}

function measureBenchmark(label, loopLimit, preheat) {
  const lib = immutLibs[label];
  let totalLibSpend = 0;
  const runForLoop = () => {
    for (let i = 0; i < loopLimit; i++) {
      totalLibSpend += oneBenchmark(lib, reuseBase, hasArr, lessDeepOp);
    }
  };
  if (preheat) {
    return runForLoop();
  }

  console.log(` ------------- ${label} benchmark ------------- `);
  runForLoop();
  util.showMem();
  console.log(`${label} avg spend ${totalLibSpend / loopLimit} ms \n`);
}


// start test
measureBenchmark('limu', loopLimit);
measureBenchmark('immer', loopLimit);
measureBenchmark('pstr', loopLimit);
// measureBenchmark('none', loopLimit);

