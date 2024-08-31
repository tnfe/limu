const { noop } = require('./_util');
const { runPerfCase } = require('./_perfUtil');

runPerfCase({
  loopLimit: 100,
  arrLen: 10000,
  userBenchmark: (params) => {
    const { lib, base, moreDeepOp } = params;
    lib.produce(base, (draft) => {
      noop(draft.a);
      if (moreDeepOp) {
        noop(draft.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z);
        noop(draft.a.b.c.d.e.f.g);
        noop(draft.a.b.c.d.e.f);
        noop(draft.a.b.c.d.e);
        noop(draft.a.b.c.d);
        noop(draft.a.b.c);
        noop(draft.a.b);
        noop(draft.aaa);
        noop(draft.a);
        noop(draft.a1.b.c.d.e.f.g.h.i.j.k.l.m.n);
        noop(draft.a2.b.c.d.e.f.g.h.i.j.k.l.m.n);
        noop(draft.a3.b.c.d.e.f.g.h.i.j.k.l.m.n);
        noop(draft.a4.b.c.d.e.f.g.h.i.j.k.l.m.n);
        noop(draft.a5.b.c.d.e.f.g.h.i.j.k.l.m.n);
        noop(draft.a6.b.c.d.e.f.g.h.i.j.k.l.m.n);
        noop(draft.a7.b.c.d.e.f.g.h.i.j.k.l.m.n);
      }
    });
  },
}).catch(console.error);
