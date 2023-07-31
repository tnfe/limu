const { noop } = require('./_util');
const { runPerfCase } = require('./_perfUtil');

runPerfCase({
  loopLimit: 200,
  arrLen: 10000,
  userBenchmark: (params) => {
    const { lib, base, operateArr, moreDeepOp } = params;

    const draft = lib.createDraft(base);
    noop(draft.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z);
    if (moreDeepOp) {
      noop(draft.a.b.c.d.e.f.g);
      noop(draft.a.b.c.d.e.f);
      noop(draft.a.b.c.d.e);
      noop(draft.a.b.c.d);
      noop(draft.a.b.c);
      noop(draft.a.b);
      noop(draft.a);
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

    if (operateArr) {
      draft.arr.forEach((item, idx) => { // bad way
        // lib.original(draft.arr).forEach((item, idx) => { // good way
        // if (idx === 100) { draft.arr[1].a = 1; }
        draft.arr[1].a = 1;
      });
    }

    const final = lib.finishDraft(draft);
  },
}).catch(console.error);
