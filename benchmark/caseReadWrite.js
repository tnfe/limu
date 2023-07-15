const { die } = require('./_util');
const { runPerfCase } = require('./_perfUtil');

runPerfCase({
  loopLimit: 200,
  arrLen: 10000,
  userBenchmark: (params) => {
    const { lib, base, operateArr, moreDeepOp } = params;

    const draft = lib.createDraft(base);
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
      const arr = draft.arr;
      // arr.forEach((item, idx) => { // bad way
      lib.original(arr).forEach((item, idx) => { // good way
        if (idx > 0 && idx % 6000 === 0) {
          arr[idx].a = 888;
        }
      });
    }
    const final = lib.finishDraft(draft);

    const draft2 = lib.createDraft(final); // another draft
    draft2.k1.k1_1 = 200;
    if (moreDeepOp) {
      draft2.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z = 888;
      draft2.a1.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
      draft2.a2.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
      draft2.a3.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
      draft2.a4.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
      draft2.a5.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
      draft2.a6.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
      draft2.a7.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
    }
    const f2 = lib.finishDraft(draft2);
    if (operateArr && lib.__NATIVE_JS__ !== true) {
      if (final.arr[6000].a !== 888) {
        die('final.arr[6000]');
      }
      if (base.arr[6000].a !== 1) {
        die('base.arr[6000]');
      }
    }

    if (operateArr) {
      const draft3 = lib.createDraft(base);
      delete draft3.b;
      draft3.arr[1].a = 888;
      draft3.arr.push({ a: 'limu' });
      draft3.arr.push({ a: 'limu' });
      draft3.arr.push({ a: 'limu' });
      draft3.arr.push({ a: 'limu' });
      const final2 = lib.finishDraft(draft3);
      final2.arr[1].a = 666;
    }

  },
}).catch(console.error);

