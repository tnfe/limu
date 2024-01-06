const { die, noop } = require('./_util');
const { runPerfCase } = require('./_perfUtil');

runPerfCase({
  loopLimit: 1000,
  arrLen: 10000,
  userBenchmark: (params) => {
    const { lib, base, operateArr, moreDeepOp } = params;
    const final = lib.produce(base, (draft) => {
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

    if (base === final) {
      die('base === final', lib);
    }
  },
}).catch(console.error);
