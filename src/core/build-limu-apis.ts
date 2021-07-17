import {
  getMetaVer,
  getMeta,
  getNextMetaLevel,
  setMeta,
  getKeyPath,
  getMetaForDraft,
  getDataNodeType,
  isDraft,
  shouldUseProxyItems,
} from './helper';
import { finishHandler, verKey } from '../support/symbols';
import { carefulDataTypes } from '../support/consts';
import { isPrimitive, canBeNum, isFn, noop, isSymbol } from '../support/util';
import { copyAndGetDataNode, clearAllDataNodeMeta, ensureDataNodeMetasProtoLayer } from './data-node-processor';
import { ObjectLike } from '../inner-types';


export function buildLimuApis() {

  const immutApis = (() => {
    const metaVer = getMetaVer();
    let called = false;
    let revoke: null | (() => void) = null;

    var copyOnWriteTraps = {
      get: (parent, key) => {
        console.log('Get', key);
        if (key === verKey) {
          return metaVer;
        }

        if (key === '__proto__' || key === finishHandler) {
          return parent[key];
        }

        if (isSymbol(key)) {
          return parent[key];
        }

        const parentType = getDataNodeType(parent);
        const parentMeta = getMeta(parent, metaVer);

        // copyWithin、sort 、valueOf... will hit the keys of 'asymmetricMatch', 'nodeType',
        // 配合 data-node-processor 里的 ATTENTION_1
        if ([carefulDataTypes.Array, carefulDataTypes.Set].includes(parentType)) {
          if (['length', 'constructor', 'asymmetricMatch', 'nodeType'].includes(key)) {
            if (parentMeta) {
              return parentMeta.copy ? parentMeta.copy[key] : parentMeta.self[key];
            }
          } else if (key === verKey) {
            return metaVer;
          }
        }

        let currentChildVal = parent[key];
        // console.log('Read', getKeyPath(parent, key, metaVer));
        // console.log('Get ', parent, key);

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

        const createMeta = (currentChildVal) => {
          if (currentChildVal && !isPrimitive(currentChildVal)) {
            let meta = getMeta(currentChildVal, metaVer);

            if (!isFn(currentChildVal)) {
              console.log('-> step 2, build proxy for ', currentChildVal);
              ensureDataNodeMetasProtoLayer(currentChildVal, metaVer);

              // 惰性生成代理对象和其元数据
              if (!meta) {
                meta = {
                  rootMeta: null,
                  parentMeta: null,
                  parent,
                  self: currentChildVal,
                  key,
                  keyPath: getKeyPath(parent, key, metaVer),
                  level: getNextMetaLevel(parent, metaVer),
                  proxyVal: new Proxy(currentChildVal, copyOnWriteTraps),
                  copy: null,
                  modified: false,
                  proxyItems: null,
                  finishDraft: noop,
                  ver: metaVer,
                };
                // console.log('currentChildVal', currentChildVal);

                const parentMeta = getMeta(parent, metaVer);
                if (parentMeta) {
                  meta.parentMeta = parentMeta;
                  meta.rootMeta = parentMeta.rootMeta;
                }
                setMeta(currentChildVal, meta, metaVer);
              }

              return meta.proxyVal;
            } else {
              if (shouldUseProxyItems(parentType, key)) {
                meta = getMeta(parent, metaVer);
                if (!meta) {
                  throw new Error('[[ createMeta ]]: oops, meta should not be null');
                }

                if (!meta.proxyItems) {
                  // 提前完成遍历，为所有item生成代理
                  let proxyItems: any = null;
                  if (parentType === carefulDataTypes.Set) {
                    const tmp = new Set();
                    (parent as Set<any>).forEach((val) => tmp.add(createMeta(val)));
                    proxyItems = tmp;
                  } else if (parentType === carefulDataTypes.Map) {
                    const tmp = new Map();
                    (parent as Map<any, any>).forEach((val, key) => tmp.set(key, createMeta(val)));
                    proxyItems = tmp;
                  } else if (parentType === carefulDataTypes.Array) {
                    const tmp: any[] = [];
                    (parent as any[]).forEach((val) => tmp.push(createMeta(val)));
                    proxyItems = tmp;
                  }

                  meta.proxyItems = proxyItems;
                }
              }

              return currentChildVal;
            }
          }

          return currentChildVal;
        };

        // 可能会指向代理对象
        currentChildVal = createMeta(currentChildVal);

        // 用下标取数组时，可直接返回
        // 例如数组操作: arrDraft[0].xxx = 'new'， 此时 arrDraft[0] 需要操作的是代理对象
        if (parentType === carefulDataTypes.Array && canBeNum(key)) {
          return currentChildVal;
        }

        if (carefulDataTypes[parentType]) {
          return copyAndGetDataNode(parent, { parentType, op: key, key, value: currentChildVal, metaVer }, true);
        }

        return currentChildVal;
      },
      set: (parent, key, value) => {
        console.log('Set ', parent, key, value);
        // console.log('Set ', getKeyPath(parent, key, metaVer));
        copyAndGetDataNode(parent, { key, value, metaVer }, true);
        return true;
      },
      deleteProperty: (parent, key) => {
        copyAndGetDataNode(parent, { op: 'del', key, value: '', metaVer }, true);
        return true;
      },

      // trap function call
      // apply: function (target, thisArg, argumentsList) {
      //   console.log(`Apply `, target, thisArg, argumentsList);
      //   // expected output: "Calculate sum: 1,2"

      //   return target(argumentsList[0], argumentsList[1]) * 10;
      // },
    };

    return {
      createDraft: <T extends ObjectLike>(mayDraft: T): T => {
        if (called) {
          throw new Error('can not call new Limu().createDraft twice');
        }
        let baseState = mayDraft;
        called = true;

        if (isDraft(mayDraft)) {
          const draftMeta = getMetaForDraft(mayDraft, mayDraft[verKey]);
          // @ts-ignore
          baseState = draftMeta.self;
        }

        ensureDataNodeMetasProtoLayer(baseState, metaVer, true);
        let meta = getMeta(baseState, metaVer);
        if (!meta) {
          meta = {
            rootMeta: null,
            parent: null,
            parentMeta: null,
            self: baseState,
            copy: null,
            modified: false,
            key: '',
            keyPath: [],
            level: 0,
            proxyVal: null,
            proxyItems: null,
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

        if (!rootMeta) {
          throw new Error('oops, rootMeta should not be null!');
        }

        let final = rootMeta.self;
        // 有 copy 不一定有修改行为，这里需要做双重判断
        if (rootMeta.copy && rootMeta.modified) {
          final = rootMeta.copy;
        }

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
