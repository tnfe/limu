// copy from node_modules/structurajs/dist/cjs.js

'use strict';
var ee = Object.defineProperty;
var te = (e, t, r) => (t in e ? ee(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : (e[t] = r));
var C = (e, t, r) => (te(e, typeof t != 'symbol' ? t + '' : t, r), r);
Object.defineProperties(exports, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: 'Module' } });
const N = { strictCopy: !1, autoFreeze: !1, standardPatches: !1 };
function re(e = !0) {
  N.strictCopy = e;
}
function ne(e = !0) {
  N.autoFreeze = e;
}
function se(e = !0) {
  N.standardPatches = e;
}
var d = ((e) => (
  (e.primitive = 'primitive'),
  (e.function = 'function'),
  (e.object = 'object'),
  (e.Object = '[object Object]'),
  (e.Array = '[object Array]'),
  (e.String = '[object String]'),
  (e.Boolean = '[object Boolean]'),
  (e.Number = '[object Number]'),
  (e.Date = '[object Date]'),
  (e.RegExp = '[object RegExp]'),
  (e.Map = '[object Map]'),
  (e.Set = '[object Set]'),
  (e.Promise = '[object Promise]'),
  e
))(d || {});
const Q = Object.prototype.toString;
function W(e) {
  return Q.call(e);
}
function X(e) {
  return D(e) ? 'primitive' : typeof e == 'function' ? 'function' : Q.call(e);
}
function D(e) {
  if (e === null) return !0;
  const t = typeof e;
  return t !== 'function' && t !== 'object';
}
function M(e, t, r) {
  const s = Object.getOwnPropertySymbols(e);
  let a,
    n = 0,
    o = s.length;
  for (; n !== o; n++) {
    a = s[n];
    const c = e[a];
    (t[a] = c), r && r(c, a, t);
  }
  const l = Object.keys(e);
  for (o = l.length, n = 0; n !== o; n++) {
    a = l[n];
    const c = e[a];
    (t[a] = c), r && r(c, a, t);
  }
  return t;
}
function ae(e, t) {
  const r = Object.getOwnPropertyDescriptors(e);
  for (const l in r) {
    const c = r[l];
    (c.writable = !0), l !== 'length' && (c.configurable = !0), (c.value = c.value || e[l]), t && t(c.value, 'value', c);
  }
  const s = Object.getOwnPropertySymbols(r),
    a = s.length;
  let n = 0,
    o;
  for (; n !== a; n++) {
    o = s[n];
    const l = r[o];
    (l.writable = !0), (l.configurable = !0), (l.value = l.value || e[o]), t && t(l.value, 'value', l);
  }
  return Object.create(Object.getPrototypeOf(e), r);
}
function B(e, t, r) {
  return (q[t || X(e)] || q[d.Object])(e, r);
}
const q = {
    [d.primitive](e, t) {
      return e;
    },
    [d.function](e, t) {
      return M(e, e.bind(null), t);
    },
    [d.Object](e, t) {
      if (N.strictCopy) return ae(e, t);
      {
        const r = e.constructor;
        return !r || r.name === 'Object' ? M(e, {}, t) : M(e, Object.create(Object.getPrototypeOf(e)), t);
      }
    },
    [d.Array](e, t) {
      const r = e.slice(0);
      return t && r.forEach(t), r;
    },
    [d.String](e, t) {
      return M(e, new String(e.toString()), t);
    },
    [d.Boolean](e, t) {
      return M(e, new Boolean(!!e), t);
    },
    [d.Number](e, t) {
      return M(e, new Number(e.valueOf()), t);
    },
    [d.Date](e, t) {
      return M(e, new Date(+e), t);
    },
    [d.RegExp](e, t) {
      return M(e, new RegExp(e.source, e.flags), t);
    },
    [d.Map](e, t) {
      const r = new Map();
      return (
        e.forEach(function (s, a) {
          r.set(a, s), t && t(s, a, r);
        }),
        r
      );
    },
    [d.Set](e, t) {
      const r = new Set();
      return (
        e.forEach(function (s) {
          r.add(s), t && t(s, void 0, r);
        }),
        r
      );
    },
  },
  F = Symbol(),
  R = Symbol(),
  L = Symbol(),
  j = Symbol();
function T(e) {
  return typeof e > 'u' || e === null ? e : e[R] || e;
}
function Y(e) {
  return typeof e > 'u' || e === null ? e : e[F] || e;
}
function ie(e) {
  if (!(typeof e > 'u' || e === null)) return e[L];
}
function oe(e) {
  if (!(typeof e > 'u' || e === null)) return e[j];
}
var h = ((e) => (
  (e[(e.set = 0)] = 'set'),
  (e[(e.set_map = 1)] = 'set_map'),
  (e[(e.add_set = 2)] = 'add_set'),
  (e[(e.delete = 3)] = 'delete'),
  (e[(e.delete_map = 4)] = 'delete_map'),
  (e[(e.delete_set = 5)] = 'delete_set'),
  (e[(e.clear_map = 6)] = 'clear_map'),
  (e[(e.clear_set = 7)] = 'clear_set'),
  (e[(e.set_date = 8)] = 'set_date'),
  (e[(e.append = 9)] = 'append'),
  (e[(e.append_map = 10)] = 'append_map'),
  (e[(e.append_set = 11)] = 'append_set'),
  (e[(e.producer_return = 12)] = 'producer_return'),
  (e[(e.no_op = 13)] = 'no_op'),
  e
))(h || {});
function z(e, t, r, s, a, n, o, l, c) {
  const y = [],
    p = r.get(a);
  let i = p.shallow;
  const u = p.type;
  p.modified || ((p.modified = !0), i === null && (i = p.shallow = B(a, u)));
  function _(f, m, b) {
    let v = null;
    t === 0
      ? m === 'length' && typeof p.inverseLength < 'u'
        ? ((v = p.inverseLength), delete p.inverseLength)
        : (v = i[m])
      : t === 3
      ? (v = i[m])
      : t === 1 || t === 4 || t === 6
      ? (v = i.get(m))
      : t === 2 || t === 5 || t === 7
      ? (v = m)
      : t === 8 && (v = b),
      (t === 0 || t === 1) && typeof v < 'u' && (f = t);
    const w = t === 0 || t === 1 || t === 2;
    if (w && r.has(v)) {
      const S = r.get(v).parents.get(a);
      S && S.delete(m);
    }
    if (s) {
      let O = b,
        S = t;
      t === 6 ? (S = 4) : t === 7 ? (S = 5) : t === 8 && (O = i.getTime()),
        y.push({ patch: { v: O, p: m, op: S }, inverse: { v, p: m, op: f } });
    }
    const E = r.get(b);
    if (E) {
      const O = E.parents;
      if (O && O.has(a)) {
        const S = O.get(a);
        w ? S.set(m, null) : (S.delete(m), S.size || O.delete(a));
      }
    }
  }
  if (t === 0) {
    const f = T(o);
    _(3, n, f), (i[n] = f);
  } else if (t === 3) {
    const f = i[n];
    _(0, n, f), delete i[n];
  } else if (t === 1) {
    const f = T(o);
    _(4, n, f), i.set(n, f);
  } else if (t === 4) {
    const f = i.get(n);
    _(1, n, f), i.delete(n);
  } else if (t === 6) {
    for (const f of i.entries()) _(1, f[0], T(f[1]));
    i.clear();
  } else if (t === 2) {
    const f = T(o);
    _(5, f, f), i.add(f);
  } else if (t === 5) {
    const f = T(o);
    _(2, f, f), i.delete(f);
  } else if (t === 7) {
    for (const f of i.values()) {
      const m = T(f);
      _(2, m, m);
    }
    i.clear();
  } else if (t === 8) {
    const f = i.getTime();
    i[n](...o), _(8, n, f);
  } else if (t === 9 && l) {
    let f = function (b, v, w, E) {
        let O = !1;
        if (
          (w ||
            ((m = !0),
            (O = !0),
            s ? (w = { patch: { p: v, op: E, next: [] }, inverse: { p: v, op: E, next: [] } }) : (w = !0),
            b.set(v, w)),
          s)
        ) {
          y.push(w), E === 11 && y.push({ patch: { op: 13 }, inverse: { p: o, op: 5 } });
          for (let S = 0; S !== c.length; S++) {
            const U = c[S];
            w.patch.next.push(U.patch), w.inverse.next.push(U.inverse);
          }
          w.inverse.next.reverse();
        }
        return O;
      },
      m = !1;
    if (u === d.Map) for (const [b, v] of l.entries()) f(l, b, v, 10) && i.set(b, o);
    else if (u === d.Set) for (const [b, v] of l.entries()) f(l, b, v, 11) && (i.delete(b), i.add(o));
    else for (let [b, v] of l.entries()) f(l, b, v, 9) && (i[b] = o);
    if (!m) return;
  }
  const P = p.parents,
    g = !!P.size;
  if (g) for (const [f, m] of P.entries()) z(e, 9, r, s, f, void 0, i, m, y);
  if (s && (!g || e === a)) for (let f = 0; f != y.length; f++) s.patches.push(y[f].patch), s.inversePatches.push(y[f].inverse);
}
function le(e, t) {
  let r = e,
    s;
  const a = new WeakMap();
  if (!D(e)) {
    const n = R in e ? e[R] : e;
    (r = B(n)), a.set(n, r), a.set(r, r);
  }
  for (let n = 0; n !== t.length; n++) (s = G(r, t[n], a, new WeakSet())), typeof s < 'u' && (r = s);
  return r;
}
function G(e, t, r, s) {
  if (!t) return;
  s.add(t);
  const a = t.op;
  let n, o, l;
  switch (a) {
    case h.set:
      e[t.p] = t.v;
      break;
    case h.set_map:
      e.set(t.p, t.v);
      break;
    case h.add_set:
      e.add(t.v);
      break;
    case h.delete:
      delete e[t.p], Array.isArray(e) && e.length - 1 === Number(t.p) && (e.length -= 1);
      break;
    case h.delete_map:
    case h.delete_set:
      e.delete(t.p);
      break;
    case h.clear_map:
    case h.clear_set:
      e.clear();
      break;
    case h.append:
    case h.append_map:
    case h.append_set:
      if (
        (a === h.append_map ? (o = e.get(t.p)) : a === h.append_set ? (o = t.p) : (o = e[t.p]),
        r.has(o) ? (n = r.get(o)) : ((n = B(o)), r.set(o, n), r.set(n, n)),
        a === h.append_map ? e.set(t.p, n) : a === h.append_set ? o !== n && (e.delete(o), e.add(n)) : (e[t.p] = n),
        (l = t.next),
        l)
      )
        for (let u = 0; u !== l.length; u++) {
          const _ = l[u];
          s.has(_) || G(n, _, r, s);
        }
      break;
    case h.set_date:
      e.setTime(t.v);
      break;
    case h.producer_return:
      return t.v;
    case 'add':
    case 'replace':
    case 'remove':
      let c = function (u) {
        if (D(u)) return u;
        if (!r.has(u)) {
          const _ = B(u);
          return r.set(u, _), r.set(_, _), _;
        }
        return r.get(u);
      };
      const y = t.path,
        p = (Array.isArray(y) ? y : y.split('/')).filter((u) => !!u || u === 0).map((u) => (u === '__empty__' ? '' : u));
      if (!p.length) return t.value;
      let i = e;
      p.forEach((u, _) => {
        if (_ === p.length - 1)
          switch (W(i)) {
            case d.Map:
              a === 'remove' ? i.delete(u) : i.set(u, t.value);
              break;
            case d.Set:
              a === 'remove' ? i.delete(u) : i.add(u);
              break;
            case d.Date:
              i.setTime(t.value);
              debugger;
              break;
            default:
              a === 'remove' ? (delete i[u], Array.isArray(i) && i.length - 1 === Number(u) && (i.length -= 1)) : (i[u] = t.value);
          }
        else {
          let g;
          switch (W(i)) {
            case d.Map:
              (g = c(i.get(u))), i.set(u, g);
              break;
            case d.Set:
              (g = c(u)), i.delete(u), i.add(g);
              break;
            default:
              (g = c(i[u])), (i[u] = g);
          }
          i = g;
        }
      });
      break;
  }
}
function H(e, t = !0, r = [], s = [], a = null) {
  let n = 0,
    o = e.length;
  for (; n !== o; n++) {
    const l = e[n],
      c = a || new WeakSet();
    if (c.has(l)) continue;
    c.add(l);
    const y = l.op;
    if (y === h.no_op) continue;
    const p = 'p' in l ? [...r, l.p] : r;
    if (!(y === h.append || y === h.append_map || y === h.append_set)) {
      const _ = y === h.delete || y === h.delete_map || y === h.delete_set;
      s.push({ op: _ ? 'remove' : 'replace', path: t ? p : ue(p), value: l.v });
    }
    const u = l.next;
    u && H(u, t, p, s, c);
  }
  return s;
}
function ue(e) {
  let t = '';
  for (let r = 0; r !== e.length; r++) {
    const s = e[r];
    t += '/' + (s === '' ? '__empty__' : s);
  }
  return t;
}
const fe = function (e, t, r, s, a) {
  let n;
  if (t.has(e)) {
    if (((n = t.get(e)), s)) {
      const o = n.parents;
      o.has(s) ? o.get(s).set(a, null) : o.set(s, new Map([[a, null]]));
    }
  } else {
    n = { original: e, type: W(e), shallow: null, modified: !1, parents: s ? new Map([[s, new Map([[a, null]])]]) : new Map() };
    const o = n.type === d.Array ? [n] : { 0: n };
    (n.proxy = new Proxy(o, r)), t.set(e, n);
  }
  return n;
};
function Z(e) {
  return !D(e) && F in e;
}
const $ = Object.values(d).filter((e) => e.charAt(0) === '[' && e !== d.Promise);
function I(e) {
  if (!e) return !1;
  const t = typeof e;
  return t === d.function ? !0 : t === d.object && $.includes(W(e));
}
const J = () => {
  throw Error('This object has been frozen and should not be mutated');
};
function x(e, t = !1, r = !1) {
  if (t && I(e) && !Object.isFrozen(e) && !(F in e))
    switch (W(e)) {
      case d.Map:
        const s = e;
        (s.set = s.clear = s.delete = J),
          Object.freeze(e),
          r &&
            s.forEach((n, o) => {
              x(o, !0, !0), x(n, !0, !0);
            });
        break;
      case d.Set:
        const a = e;
        (a.add = a.clear = a.delete = J), Object.freeze(e), r && a.forEach((n) => x(n, !0, !0));
        break;
      default:
        if ((Object.freeze(e), r)) {
          const n = Reflect.ownKeys(e);
          for (let o = 0; o !== n.length; o++) x(e[n[o]], !0, !0);
        }
    }
  return e;
}
function ce(e) {
  if (Object.isFrozen(e)) throw new Error("This object has been frozen at runtime and can't be unfreezed");
  return e;
}
class de {
  constructor(t, r, s, a) {
    C(this, 'state');
    C(this, 'data');
    C(this, 'pStore');
    C(this, 'proxify');
    (this.state = t), (this.data = r), (this.pStore = s), (this.proxify = a);
  }
  get(t, r, s) {
    const a = this.state,
      n = this.data,
      o = this.pStore,
      l = this.proxify,
      c = this,
      y = t[0],
      p = y.original;
    if (r === F) return p;
    if (r === L) return y;
    if (r === j) return n;
    const i = y.shallow || p;
    if (r === R) return i;
    const u = Reflect.get(i, r, s);
    if (D(u)) return u;
    const _ = y.type;
    if (_ === d.Map) {
      if (typeof u === d.function)
        return r === 'set'
          ? function (P, g) {
              return i.get(P) !== g && z(a, h.set_map, n, o, p, P, g), s;
            }
          : r === 'delete'
          ? function (P) {
              const g = i.has(P);
              return g && z(a, h.delete_map, n, o, p, P), g;
            }
          : r === 'clear'
          ? function () {
              z(a, h.clear_map, n, o, p);
            }
          : r === 'get'
          ? function (P) {
              const g = i.get(P);
              return D(g) ? g : l(g, n, c, p, P).proxy;
            }
          : r === 'values' || r === 'entries'
          ? function* () {
              const g = r === 'entries',
                f = i.entries();
              let m, b, v;
              for (m of f) {
                const w = m[1];
                (b = D(w) ? w : l(w, n, c, p, m[0]).proxy), yield g ? [v, b] : b;
              }
            }
          : r === 'forEach'
          ? function (g) {
              i.forEach(function (f, m) {
                g(D(f) ? f : l(f, n, c, p, m).proxy);
              });
            }
          : u.bind(l(p, n, c).proxy);
    } else if (_ === d.Set && typeof u === d.function)
      return r === 'add'
        ? function (g) {
            return i.has(g) || z(a, h.add_set, n, o, p, void 0, g), s;
          }
        : r === 'delete'
        ? function (g) {
            const f = i.has(g);
            return f && z(a, h.delete_set, n, o, p, void 0, g), f;
          }
        : r === 'clear'
        ? function () {
            z(a, h.clear_set, n, o, p);
          }
        : r === 'values' || r === 'entries'
        ? function* () {
            const f = r === 'entries',
              m = i.values();
            let b, v;
            for (b of m) (v = D(b) ? b : l(b, n, c, p, b).proxy), yield f ? [v, v] : v;
          }
        : r === 'forEach'
        ? function (f) {
            i.forEach(function (m) {
              f(D(m) ? m : l(m, n, c, p, m).proxy);
            });
          }
        : u.bind(l(p, n, c).proxy);
    if (_ === d.Date) {
      if (typeof u === d.function)
        return r.indexOf('set') === 0
          ? function (...P) {
              return z(a, h.set_date, n, o, p, r, P), s;
            }
          : i[r].bind(i);
    } else if (typeof u === d.function) {
      const P = l(p, n, c);
      return _ === d.Array && (P.inverseLength = p.length), u.bind(P.proxy);
    }
    return l(u, n, c, p, r).proxy;
  }
  set(t, r, s, a) {
    const n = this.state,
      o = this.data,
      l = this.pStore,
      y = t[0].original;
    return Reflect.get(y, r, a) !== s && z(n, h.set, o, l, y, r, s), !0;
  }
  deleteProperty(t, r) {
    const s = this.state,
      a = this.data,
      n = this.pStore,
      l = t[0].original;
    return z(s, h.delete, a, n, l, r), !0;
  }
  has(t, r) {
    if (r === F || r === R || r === L || r === j) return !0;
    const s = t[0],
      a = s.original,
      n = s.shallow || a;
    return r in n;
  }
  ownKeys(t) {
    const r = t[0],
      s = r.original,
      a = r.shallow || s;
    return Reflect.ownKeys(a);
  }
  getOwnPropertyDescriptor(t, r) {
    const s = t[0],
      a = s.original,
      n = s.shallow || a,
      o = Object.getOwnPropertyDescriptor(n, r);
    if (!!o)
      return {
        writable: !0,
        configurable: r === 'length' && Array.isArray(a) ? o.configurable : !0,
        enumerable: o.enumerable,
        value: n[r],
      };
  }
  getPrototypeOf(t) {
    const s = t[0].original;
    return Object.getPrototypeOf(s);
  }
}
const K = {};
function V(e, t, r, { proxify: s = fe } = {}) {
  if (!I(e)) {
    const i = t(e);
    if (r)
      if (N.standardPatches) {
        const u = 'replace';
        r([{ value: i, op: u }], [{ value: e, op: u }]);
      } else {
        const u = h.producer_return;
        r([{ v: i, op: u }], [{ v: e, op: u }]);
      }
    return i;
  }
  const a = new WeakMap(),
    n = r ? { patches: [], inversePatches: [] } : null,
    o = new de(e, a, n, s);
  let l,
    c = e;
  L in e ? ((c = e[R]), (l = e[L])) : (l = s(e, a, o));
  const y = t(l.proxy);
  function p(i) {
    const u = l.modified ? l.shallow : c,
      _ = typeof i < 'u',
      P = i === K;
    if (r && n) {
      if (_) {
        !P && !a.has(i) && (n.patches = []);
        const f = h.producer_return;
        n.patches.push({ v: P ? void 0 : T(i), op: f }), n.inversePatches.push({ v: u, op: f });
      }
      N.standardPatches ? r(H(n.patches), H(n.inversePatches.reverse())) : r(n.patches, n.inversePatches.reverse());
    }
    if (P) return;
    const g = _ ? T(i) : u;
    return N.autoFreeze && (x(c, !0, !0), x(g, !0, !0)), g;
  }
  return W(y) === d.Promise ? y.then(p) : p(y);
}
function k(e, t) {
  let r, s;
  function a(o, l) {
    (r = o), (s = l);
  }
  return [V(e, t, a), r, s];
}
async function A(e, t) {
  let r, s;
  function a(n, o) {
    (r = n), (s = o);
  }
  return V(e, t, a).then((n) => [n, r, s]);
}
const pe = V,
  he = k,
  ge = V,
  ye = V,
  me = A;
function _e(e) {
  if (!Z(e)) return e;
  function t(s, a, n) {
    if (!n) return;
    const o = typeof n;
    if (o === d.object || o === d.function) {
      const l = W(n),
        c = r(s);
      l === d.Map ? n.set(a, c) : l === d.Set ? n.add(c) : (n[a] = c);
    }
  }
  function r(s) {
    const a = Y(s),
      n = T(s);
    return n === a ? a : B(n, void 0, t);
  }
  return r(e);
}
exports.DraftableTypes = $;
exports.NOTHING = K;
exports.Settings = N;
exports.Traps_all_data = j;
exports.Traps_item_data = L;
exports.Traps_self = F;
exports.Traps_target = R;
exports.Types = d;
exports.allData = oe;
exports.applyPatch = G;
exports.applyPatches = le;
exports.asyncProduce = ge;
exports.asyncProduceWithPatches = A;
exports.asyncSafeProduce = ye;
exports.asyncSafeProduceWithPatches = me;
exports.convertPatchesToStandard = H;
exports.enableAutoFreeze = ne;
exports.enableStandardPatches = se;
exports.enableStrictCopy = re;
exports.freeze = x;
exports.isDraft = Z;
exports.isDraftable = I;
exports.isPrimitive = D;
exports.itemData = ie;
exports.original = Y;
exports.produce = V;
exports.produceWithPatches = k;
exports.safeProduce = pe;
exports.safeProduceWithPatches = he;
exports.snapshot = _e;
exports.target = T;
exports.toStringArchtype = X;
exports.toStringType = W;
exports.unfreeze = ce;
