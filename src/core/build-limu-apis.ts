import {
  getMetaVer,
  getMeta,
  getLevel,
  setMeta,
  getKeyPath,
  getMetaForDraft,
  isDraft,
} from './helper';
import { finishHandler, verKey } from '../support/symbols';
import { isPrimitive } from '../support/util';
import { copyDataNode, clearAllDataNodeMeta, ensureDataNodeMetasProtoLayer } from './data-node-processor'


export function buildLimuApis() {

  const immutApis = (() => {
    const metaVer = getMetaVer();
    let called = false;
    let revoke: null | (() => void) = null;

    var copyOnWriteTraps = {
      get: (parent, key) => {
        // debugger;
        let currentChildVal = parent[key];
        if (key === '__proto__' || key === finishHandler) {
          return currentChildVal;
        }
        if (key === verKey) {
          return metaVer;
        }
        // console.log('Read', getKeyPath(parent, key, metaVer));

        const parentMeta = getMeta(parent, metaVer);

        // 第 2+ 次进入 key 的 get 函数，已为 parent 生成了代理
        if (parentMeta) {
          const { self, copy } = parentMeta;
          const originalChildVal = self[key];
          // 存在 copy，则从 copy 上获取
          if (copy) currentChildVal = copy[key];

          // 产生了节点替换情况（此时currentChildVal应该是从 copy 里 获取的）
          // 直接返回 currentChildVal 即可
          // 因为 currentChildVal 已经是一个全新的值，无需对它做代理
          // ori: { a: 1 },     cur: 1 
          // ori: 1,            cur: { a: 1 } 
          // ori: 1,            cur: 2 
          // ori: { a: 1 }      cur: { a: 1 } 
          if (originalChildVal !== currentChildVal) {
            // 返回出去的值因未做代理，之后对它的取值行为不会再进入到 get 函数中
            // todo：后续版本考虑 createDraft 加参数来控制是否为这种已替换节点也做代理
            return currentChildVal;
          }
        }

        if (currentChildVal && !isPrimitive(currentChildVal)) {
          ensureDataNodeMetasProtoLayer(currentChildVal, metaVer);
          let meta = getMeta(currentChildVal, metaVer);

          // 惰性生成代理对象和其元数据
          if (!meta) {
            const level = getLevel(parent, metaVer);
            // debugger;
            meta = {
              parent,
              self: currentChildVal,
              key,
              keyPath: getKeyPath(parent, key, metaVer),
              level,
              proxyVal: new Proxy(currentChildVal, copyOnWriteTraps),
            };

            const parentMeta = getMeta(parent, metaVer);
            if (parentMeta && level > 0) {
              meta.parentMeta = parentMeta;
              meta.rootMeta = parentMeta.rootMeta;
            }
            setMeta(currentChildVal, meta, metaVer);
          }

          // 指向代理对象
          currentChildVal = meta.proxyVal;
        }

        if (Array.isArray(parent)) {
          if (key === 'pop') {
            return copyDataNode(parent, { op: 'pop', key, value: '', metaVer }, true);
          }
          if (key === 'splice') {
            return copyDataNode(parent, { op: 'splice', key, value: '', metaVer }, true);
          }
        }

        return currentChildVal;
      },
      set: (parent, key, value) => {
        // console.log('Set ', getKeyPath(parent, key, metaVer));
        copyDataNode(parent, { key, value, metaVer }, true);
        return true;
      },
      deleteProperty: (parent, key) => {
        copyDataNode(parent, { op: 'del', key, value: '', metaVer }, true);
        return true;
      },
    };

    return {
      /**
       * @template {any} T
       * @param {T} baseState 
       * @returns {T}
       */
      createDraft: (mayDraft) => {
        if (called) {
          throw new Error(`can not call new Immut().createDraft twice`);
        }
        let baseState = mayDraft;
        called = true;

        if (isDraft(mayDraft)) {
          const draftMeta = getMetaForDraft(mayDraft, mayDraft[verKey]);
          baseState = draftMeta.self;
        }

        ensureDataNodeMetasProtoLayer(baseState, metaVer, true);
        let meta = getMeta(baseState, metaVer);
        if (!meta) {
          meta = {
            parent: null,
            self: baseState,
            key: '',
            keyPath: [],
            level: 0,
            proxyVal: null,
            parentMeta: null,
            finishDraft: immutApis.finishDraft,
            ver: metaVer,
          };
          meta.rootMeta = meta;
          setMeta(baseState, meta, metaVer);
        }
        const { proxy: proxyDraft, revoke: revokeHandler } = Proxy.revocable(baseState, copyOnWriteTraps);
        meta.proxyVal = proxyDraft;
        revoke = revokeHandler;
        return proxyDraft;
      },
      // finishDraft: (proxyDraft, options = {}) => {
      finishDraft: (proxyDraft) => {
        // attention: if pass a revoked proxyDraft
        // it will throw: Cannot perform 'set' on a proxy that has been revoked

        // 再次检查，以免用户是用 new Immut() 返回的 finishDraft 
        // 去结束另一个 new Immut() createDraft 的 草稿对象
        if (metaVer !== proxyDraft[verKey]) {
          throw new Error('oops, the input draft does not match finishDraft handler');
        }

        const rootMeta = getMetaForDraft(proxyDraft, metaVer);
        const final = rootMeta.copy || rootMeta.self;

        // todo: 留着这个参数，解决多引用问题
        // var base = { a: { b: { c: 1 } }, b: null };
        // base.b = base.a.b;
        // var im = new Immut();
        // var d = im.createDraft(base);
        // d.b.c = 888;
        // if (options.multiRef && rootMeta.copy) {
        // }

        revoke && revoke();
        clearAllDataNodeMeta(metaVer);
        return final;
      },
    };
  })();

  return immutApis;
}
