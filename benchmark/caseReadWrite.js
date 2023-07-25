const { die, noop } = require('./_util');
const { runPerfCase } = require('./_perfUtil');

runPerfCase({
  loopLimit: 200,
  arrLen: 10000,
  userBenchmark: (params) => {
    const { lib, base, operateArr, moreDeepOp } = params;

    const draft = lib.createDraft(base);
    draft.k1.k1_1 = 20;
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
      draft.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z = 666;
      draft.a1.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
      draft.a2.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
      draft.a3.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
      draft.a4.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
      draft.a5.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
      draft.a6.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
      draft.a7.b.c.d.e.f.g.h.i.j.k.l.m.n = 2;
    }

    const arr = draft.arr;
    const lastIdx = arr.length - 1;
    if (operateArr) {
      // arr.forEach((item, idx) => { // bad way
      lib.original(arr).forEach((item, idx) => { // good way
        if (idx === lastIdx) {
          arr[idx].a = 888;
        }
      });
    }
    const final = lib.finishDraft(draft);
    if (operateArr && lib.__NATIVE_JS__ !== true) {
      if (final.arr[lastIdx].a !== 888) {
        die('final.arr lastIdx');
      }
      if (base.arr[lastIdx].a !== 1) {
        die('base.arr lastIdx');
      }
    }

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
    const final2 = lib.finishDraft(draft2);
    if (lib.__NATIVE_JS__ !== true) {
      if (final2 === final) {
        die('final2 === final');
      }
    }

    if (operateArr) {
      const draft3 = lib.createDraft(base);
      delete draft3.b;
      draft3.arr[draft3.arr.length - 1].a = 888;
      draft3.arr.push({ a: 'limu' });
      draft3.arr.push({ a: 'limu' });
      draft3.arr.push({ a: 'limu' });
      draft3.arr.push({ a: 'limu' });
      const final2 = lib.finishDraft(draft3);
      final2.arr[1].a = 666;
    }

  },
}).catch(console.error);

