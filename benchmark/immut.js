/**
 * this test is for helping found immut mem leak
 * now it is fixed gte v3.8.0
 */
const { die, noop } = require('./_util');
const { runPerfCase } = require('./_perfUtil');

runPerfCase({
  loopLimit: 1,
  arrLen: 10000,
  seeMemLeakTimes: 20,
  userBenchmark: (params) => {
    const { lib, base, operateArr, moreDeepOp } = params;
    const immutData = lib.immut(base);

    let nextBase = base;
    for (let i = 0; i <= 1000; i++) {
      const newBase = lib.produce(nextBase, (draft) => {
        draft.k1.k1_1 = 20;
        if (moreDeepOp) {
          draft.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z = 666;
          draft.a1.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
          draft.a2.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
          draft.a3.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
          draft.a4.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
          draft.a5.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
          draft.a6.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
          draft.a7.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
        }

        if (operateArr) {
          draft.arr[draft.arr.length - 1].a = 888;
          // draft.arr.forEach((item, idx) => { // bad way
          lib.original(draft.arr).forEach((item, idx) => { // good way
            if (idx === 100) {
              draft.arr[1].a = 888;
            }
          });
        }
      });
      nextBase = newBase;

      // read immut
      const z = immutData.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z;
      const z1 = immutData.a1.b.c.d.e.f.g.h.i.j.k.l.m.n;
      const z2 = immutData.a2.b.c.d.e.f.g.h.i.j.k.l.m.n;
      const z3 = immutData.a3.b.c.d.e.f.g.h.i.j.k.l.m.n;
      const z4 = immutData.a4.b.c.d.e.f.g.h.i.j.k.l.m.n;
      const z5 = immutData.a5.b.c.d.e.f.g.h.i.j.k.l.m.n;
      const z6 = immutData.a6.b.c.d.e.f.g.h.i.j.k.l.m.n;
      const z7 = immutData.a7.b.c.d.e.f.g.h.i.j.k.l.m.n;
    }

  },
}).catch(console.error);
