(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self), factory((global.limu = {})));
})(this, function (exports) {
  'use strict';

  /**
   * 因 3.0 做了大的架构改进，让其行为和 immer 保持了 100% 一致，和 2.0 版本处于不兼容状态
   * 此处标记版本号辅助测试用例为2.0走一些特殊逻辑
   */
  const VER$1 = '3.13.0';
  /** meta 数据key，仅 debug 模式才挂到对象的原型上 */
  const META_KEY = Symbol('M');
  /** 版本号key */
  const META_VER = Symbol('V');
  const IMMUT_BASE = Symbol('IMMUT_BASE');
  /** markRaw 调用会给对象标记 IS_RAW 为 true */
  const IS_RAW = Symbol('IS_RAW');
  const MAP = 'Map';
  const SET = 'Set';
  const ARRAY = 'Array';
  const OBJECT = 'Object';
  /**
   * limu 需要关心的 symbol 读取 key 列表
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
   */
  const JS_SYM_KEYS = [Symbol.iterator, Symbol.toStringTag, IS_RAW];
  const CAREFUL_TYPES = { Map: MAP, Set: SET, Array: ARRAY };
  const OBJ_DESC = '[object Object]';
  const MAP_DESC = '[object Map]';
  const SET_DESC = '[object Set]';
  const ARR_DESC = '[object Array]';
  const FN_DESC = '[object Function]';
  const desc2dataType = {
    [MAP_DESC]: MAP,
    [SET_DESC]: SET,
    [ARR_DESC]: ARRAY,
    [OBJ_DESC]: OBJECT,
  };
  const SHOULD_REASSIGN_ARR_METHODS = ['push', 'pop', 'shift', 'splice', 'unshift', 'reverse', 'copyWithin', 'delete', 'fill'];
  const SHOULD_REASSIGN_MAP_METHODS = ['set', 'clear', 'delete'];
  const SHOULD_REASSIGN_SET_METHODS = ['add', 'clear', 'delete'];
  const CHANGE_ARR_ORDER_METHODS = ['splice', 'sort', 'unshift', 'shift'];
  const arrFnKeys = [
    'concat',
    'copyWithin',
    'entries',
    'every',
    'fill',
    'filter',
    'find',
    'findIndex',
    'flat',
    'flatMap',
    'forEach',
    'includes',
    'indexOf',
    'join',
    'keys',
    'lastIndexOf',
    'map',
    'pop',
    'push',
    'reduce',
    'reduceRight',
    'reverse',
    'shift',
    'unshift',
    'slice',
    'some',
    'sort',
    'splice',
    'values',
    'valueOf',
  ];
  const mapFnKeys = ['clear', 'delete', 'entries', 'forEach', 'get', 'has', 'keys', 'set', 'values'];
  const setFnKeys = ['add', 'clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values'];
  const CAREFUL_FNKEYS = {
    [MAP]: mapFnKeys,
    [SET]: setFnKeys,
    [ARRAY]: arrFnKeys,
  };
  const CHANGE_FNKEYS = {
    [MAP]: ['clear', 'set', 'delete'],
    [SET]: ['clear', 'add', 'delete'],
    [ARRAY]: ['pop', 'push', 'shift', 'unshift', 'splice', 'sort', 'copyWithin'],
  };
  const PROXYITEM_FNKEYS = {
    [MAP]: ['forEach', 'get'],
    [SET]: ['forEach'],
    [ARRAY]: ['forEach', 'map'],
  };

  const verWrap = { value: 0, usablePrefix: 1 };
  const conf = {
    autoFreeze: false,
    autoRevoke: true,
    fastModeRange: 'array',
  };

  const toString = Object.prototype.toString;
  const canUseReflect = !!Reflect;
  const hasProp = Object.prototype.hasOwnProperty;
  function has(obj, key) {
    if (canUseReflect) {
      return Reflect.has(obj, key);
    }
    return hasProp.call(obj, key);
  }
  function deepDrill(obj, parentObj, key, subObjCb) {
    const list = [];
    const innerDeep = (obj, parentObj, key) => {
      if (isPrimitive(obj)) {
        return;
      }
      if (list.includes(obj)) {
        // 出现循环引用，及时跳出来，避免出现错误：Maximum call stack size exceeded
        return;
      }
      list.push(obj);
      subObjCb(obj, parentObj, key);
      // const drillThenCb = (obj: any, parentObj: any, key: any) => {
      //   innerDeep(obj, parentObj, key);
      //   subObjCb(obj, parentObj, key);
      // };
      if (Array.isArray(obj)) {
        obj.forEach((item, idx) => {
          innerDeep(item, obj, idx);
        });
      }
      // TODO 处理 set
      // if (isSet(obj)) {
      //   obj.forEach((item: any) => {
      //     subObjCb(item, obj, idx);
      //   });
      // }
      if (isMap(obj)) {
        obj.forEach((value, key) => {
          innerDeep(value, obj, key);
        });
      }
      if (isObject(obj)) {
        Object.keys(obj).forEach((key) => {
          innerDeep(obj[key], obj, key);
        });
      }
    };
    innerDeep(obj, parentObj, key);
  }
  function getValStrDesc(val) {
    // return Array.isArray(val) ? ARR_DESC : toString.call(val);
    return toString.call(val);
  }
  function noop(...args) {
    return args;
  }
  function isObject(val) {
    // attention，null desc is '[object Null]'
    return getValStrDesc(val) === OBJ_DESC;
  }
  function isMap(val) {
    return getValStrDesc(val) === MAP_DESC;
  }
  function isSet(val) {
    return getValStrDesc(val) === SET_DESC;
  }
  function isFn(val) {
    return getValStrDesc(val) === FN_DESC;
  }
  function getDataType(dataNode) {
    var strDesc = getValStrDesc(dataNode);
    const dataType = desc2dataType[strDesc];
    return dataType;
  }
  function isPrimitive(val) {
    const desc = getValStrDesc(val);
    return ![OBJ_DESC, ARR_DESC, MAP_DESC, SET_DESC, FN_DESC].includes(desc);
  }
  function isPromiseFn(obj) {
    return obj.constructor.name === 'AsyncFunction' || 'function' === typeof obj.then;
  }
  function isPromiseResult(result) {
    return typeof Promise !== 'undefined' && result instanceof Promise;
  }
  function canBeNum(val) {
    var valType = typeof val;
    if (valType === 'number') return true;
    if (valType === 'string') return /^[0-9]*$/.test(val);
    return false;
  }
  function isSymbol(maySymbol) {
    return typeof maySymbol === 'symbol';
  }
  /**
   * 是否已被 markRaw 标记
   */
  function isMardedRaw(val) {
    var _a;
    if (!val) return false;
    return (_a = val[IS_RAW]) !== null && _a !== void 0 ? _a : false;
  }
  const descProto = {
    [ARR_DESC]: Array.prototype,
    [MAP_DESC]: Map.prototype,
    [SET_DESC]: Set.prototype,
    [FN_DESC]: Function.prototype,
  };
  function injectMetaProto(rawObj) {
    const desc = getValStrDesc(rawObj);
    const rootProto = descProto[desc] || Object.prototype;
    const pureObj = Object.create(null);
    Object.setPrototypeOf(pureObj, rootProto);
    Object.setPrototypeOf(rawObj, pureObj);
    return rawObj;
  }

  const ROOT_CTX = new Map();
  function markModified(meta) {
    meta.rootMeta.modified = true;
    const doMark = (meta) => {
      if (meta && !meta.modified) {
        meta.modified = true;
        doMark(meta.parentMeta);
      }
    };
    doMark(meta);
  }
  function attachMeta(dataNode, meta, options) {
    if (options.apiCtx.debug) {
      const { fast } = options;
      // speed up read performance when debug is true, especially for array forEach scene
      if (fast) {
        dataNode[META_KEY] = meta;
      } else {
        injectMetaProto(dataNode);
        dataNode.__proto__[META_KEY] = meta;
      }
    }
    return dataNode;
  }
  function getKeyPath(draftNode, curKey, apiCtx) {
    const pathArr = [curKey];
    const meta = getSafeDraftMeta(draftNode, apiCtx);
    if (meta && meta.level > 0) {
      const { keyPath } = meta;
      return [...keyPath, curKey];
    }
    return pathArr;
  }
  function newMeta(key, baseData, options) {
    const { ver, parentMeta = null, immutBase, compareVer, apiCtx, hasOnOperate } = options;
    const dataType = getDataType(baseData);
    let keyPath = [];
    let level = 0;
    let copy = null;
    if (parentMeta) {
      copy = parentMeta.copy;
      level = getNextMetaLevel(copy, apiCtx);
      keyPath = getKeyPath(copy, key, apiCtx);
    }
    const meta = {
      // @ts-ignore add later
      rootMeta: null,
      parentMeta,
      parent: copy,
      selfType: dataType,
      self: baseData,
      // @ts-ignore add later
      copy: null,
      key,
      keyPath,
      level,
      // @ts-ignore add later
      /** @type any */
      proxyVal: null,
      proxyItems: null,
      modified: false,
      scopes: [],
      isImmutBase: immutBase,
      isDel: false,
      isFast: false,
      isArrOrderChanged: false,
      newNodeStats: {},
      newNodeMap: new Map(),
      newNodes: [],
      ver,
      compareVer,
      revoke: noop,
      hasOnOperate,
      execOnOperate: noop,
    };
    if (level === 0) {
      meta.rootMeta = meta;
    } else {
      meta.rootMeta = parentMeta.rootMeta;
    }
    return meta;
  }
  /**
   * 是否是一个草稿对象代理节点
   */
  function isDraft$1(mayDraft) {
    const meta = getDraftProxyMeta(mayDraft);
    if (!meta) {
      return false;
    }
    return !meta.isImmutBase;
  }
  function genMetaVer() {
    if (verWrap.value >= Number.MAX_SAFE_INTEGER) {
      verWrap.value = 1;
      verWrap.usablePrefix += 1;
    } else {
      verWrap.value += 1;
    }
    const { value, usablePrefix } = verWrap;
    const metaVer = `${usablePrefix}_${value}`;
    return metaVer;
  }
  function getNextMetaLevel(mayContainMetaObj, apiCtx) {
    const meta = getDraftMeta(mayContainMetaObj, apiCtx);
    return meta ? meta.level + 1 : 1;
  }
  function getSafeDraftMeta(proxyDraft, apiCtx) {
    // @ts-ignore
    return apiCtx.metaMap.get(proxyDraft);
  }
  function getDraftMeta(proxyDraft, apiCtx) {
    let apiCtxVar = apiCtx || getApiCtx(proxyDraft);
    return (apiCtxVar === null || apiCtxVar === void 0 ? void 0 : apiCtxVar.metaMap.get(proxyDraft)) || null;
  }
  function getMetaVer(mayDraftProxy) {
    return mayDraftProxy ? mayDraftProxy[META_VER] || '' : '';
  }
  function getApiCtx(mayDraftProxy) {
    const ver = getMetaVer(mayDraftProxy);
    return ROOT_CTX.get(ver) || null;
  }
  function getDraftProxyMeta(mayDraftProxy) {
    const apiCtx = getApiCtx(mayDraftProxy);
    if (!apiCtx) {
      return null;
    }
    return apiCtx.metaMap.get(mayDraftProxy) || null;
  }
  /**
   * 判断两个值是否相同，true 表示不相等，false 表示相等
   */
  function isDiff$1(val1, val2) {
    const meta1 = getDraftProxyMeta(val1);
    const meta2 = getDraftProxyMeta(val2);
    if (!meta1 && !meta2) {
      return !Object.is(val1, val2);
    }
    const {
      self: self1,
      modified: modified1,
      compareVer: cv1,
      ver: ver1,
      level: level1,
    } = meta1 || { self: val1, modified: false, compareVer: false, ver: '0', level: 0 };
    const {
      self: self2,
      modified: modified2,
      compareVer: cv2,
      ver: ver2,
      level: level2,
    } = meta2 || { self: val2, modified: false, compareVer: false, ver: '0', level: 0 };
    if (self1 !== self2) {
      // self 是内部维护的值，可不用 Object.is 判断
      return true;
    }
    if ((cv1 || cv2) && (level1 === 0 || level2 === 0) && ver1 !== ver2) {
      return true;
    }
    return modified1 || modified2;
  }
  /**
   * 浅比较两个对象，除了专用于比较 helux 生成的代理对象，此函数还可以比较普通对象
   * ```txt
   * true：两个对象一样
   * false：两个对象不一样
   * ```
   */
  function shallowCompare$1(prevObj, nextObj, compareLimuProxyRaw = true) {
    const diffFn = compareLimuProxyRaw ? isDiff$1 : Object.is;
    const isObjDiff = (a, b) => {
      for (let i in a) if (!(i in b)) return true;
      for (let i in b) if (diffFn(a[i], b[i])) return true;
      return false;
    };
    const isEqual = !isObjDiff(prevObj, nextObj);
    return isEqual;
  }

  function deepCopy$1(obj) {
    const innerDeep = (obj) => {
      if (isPrimitive(obj)) {
        return obj;
      }
      // TODO: 或许这里通过 metaVer 能够解决多引用问题 ( see 3.4.2 )
      // TODO: 传入参数 reuse，确定是否走逻辑查看 meta.modified，并复用 meta.copy or meta.self
      let newNode = obj;
      if (Array.isArray(obj)) {
        newNode = obj.slice();
        newNode.forEach((item, idx) => {
          newNode[idx] = innerDeep(item);
        });
      }
      if (isSet(obj)) {
        const tmpArr = Array.from(obj);
        tmpArr.forEach((item, idx) => {
          tmpArr[idx] = innerDeep(item);
        });
        newNode = new Set(tmpArr);
      }
      if (isMap(obj)) {
        newNode = new Map(obj);
        newNode.forEach((value, key) => {
          newNode.set(key, innerDeep(value));
        });
      }
      if (isObject(obj)) {
        newNode = {};
        Object.keys(obj).forEach((key) => {
          newNode[key] = innerDeep(obj[key]);
        });
      }
      return newNode;
    };
    return innerDeep(obj);
  }
  /**
   * 尝试生成copy
   * @param val
   * @returns
   */
  function tryMakeCopy(val, options) {
    const { parentType, fastModeRange } = options;
    if (Array.isArray(val)) {
      return { copy: val.slice(), fast: false };
    }
    const fast = (fastModeRange === 'array' && parentType === ARRAY) || fastModeRange === 'all';
    let copy = val;
    if (val && isObject(val)) {
      copy = Object.assign({}, val);
    }
    if (isMap(val)) {
      copy = new Map(val);
    }
    if (isSet(val)) {
      copy = new Set(val);
    }
    return { copy, fast };
  }
  // 调用处已保证 meta 不为空
  function makeCopyWithMeta(ori, meta, options) {
    const { apiCtx, immutBase } = options;
    // LABEL: FIX IMMUT MEM LEAK
    if (immutBase) {
      return { copy: ori, fast: false };
    }
    const { copy, fast } = tryMakeCopy(ori, options);
    attachMeta(copy, meta, { apiCtx, fast });
    return { copy, fast };
  }

  function ressignArrayItem(listMeta, itemMeta, ctx) {
    const { copy, isArrOrderChanged } = listMeta;
    const { targetNode, key } = ctx;
    // 数组顺序已变化
    if (isArrOrderChanged) {
      const key = copy.findIndex((item) => item === itemMeta.copy);
      if (key >= 0) {
        copy[key] = targetNode;
      }
      return;
    }
    copy[key] = targetNode;
  }
  function isInSameScope(mayDraftProxy, callerScopeVer) {
    if (!isObject(mayDraftProxy)) {
      return true;
    }
    return getMetaVer(mayDraftProxy) === callerScopeVer;
  }
  function clearScopes(rootMeta, apiCtx) {
    const { debug } = apiCtx;
    // TODO 下钻有一定的性能损耗，允许用户关闭此逻辑 findDraftNodeNewRef=false
    const drilledMap = new Map();
    apiCtx.newNodeMap.forEach((v) => {
      const { node, parent, key } = v;
      const drilledNode = drilledMap.get(node);
      if (drilledNode) {
        // 同一个节点被多个父级引用了，只需要指向自身即可，无需再次下钻
        parent[key] = drilledNode;
        return;
      }
      const item = v;
      deepDrill(node, parent, key, (obj, parentObj, key) => {
        const meta = getDraftMeta(obj, apiCtx);
        if (meta) {
          const { modified, copy, self } = meta;
          const targetNode = !modified ? self : copy;
          parentObj[key] = targetNode;
        }
      });
      item.target = parent[key]; // 此处可能已被替换为真正的目标节点
      drilledMap.set(node, item.target);
    });
    rootMeta.scopes.forEach((meta) => {
      const { modified, copy, parentMeta, key, self, revoke, proxyVal, isDel, isFast } = meta;
      if (!copy) return revoke();
      if (debug) {
        if (isFast) {
          // @ts-ignore
          delete copy[META_KEY];
        } else {
          delete copy.__proto__[META_KEY];
        }
      }
      if (!parentMeta) return revoke();
      const targetNode = !modified ? self : copy;
      // 父节点是 Map、Set 时，parent 指向的是 ProxyItems，这里取到 copy 本体后再重新赋值
      const parentCopy = parentMeta.copy;
      const parentType = parentMeta.selfType;
      if (parentType === MAP) {
        parentCopy.set(key, targetNode);
        return revoke();
      }
      if (parentType === SET) {
        parentCopy.delete(proxyVal);
        parentCopy.add(targetNode);
        return revoke();
      }
      if (parentType === ARRAY) {
        ressignArrayItem(parentMeta, meta, { targetNode, key });
        return revoke();
      }
      if (isDel !== true) {
        parentCopy[key] = targetNode;
        return revoke();
      }
    });
    rootMeta.scopes.length = 0;
  }
  function extractFinalData(rootMeta, apiCtx) {
    const { self, copy, modified } = rootMeta;
    let final = self;
    // 有 copy 不一定有修改行为，这里需做双重判断
    if (copy && modified) {
      final = rootMeta.copy;
    }
    // if put this on first line, fail at test/set-other/update-object-item.ts
    clearScopes(rootMeta, apiCtx);
    return final;
  }
  function recordVerScope(meta) {
    meta.rootMeta.scopes.push(meta);
  }

  function createScopedMeta(key, baseData, options) {
    const { traps, parentType, fastModeRange, immutBase, apiCtx, autoRevoke } = options;
    // new meta data for current data node
    const meta = newMeta(key, baseData, options);
    const { copy, fast } = makeCopyWithMeta(baseData, meta, {
      immutBase,
      parentType,
      fastModeRange,
      apiCtx,
    });
    meta.copy = copy;
    meta.isFast = fast;
    if (immutBase) {
      const ret = new Proxy(copy, traps);
      meta.proxyVal = ret;
      meta.revoke = noop;
    } else {
      const ret = Proxy.revocable(copy, traps);
      meta.proxyVal = ret.proxy;
      meta.revoke = autoRevoke ? ret.revoke : noop;
    }
    apiCtx.metaMap.set(copy, meta);
    // apiCtx.metaMap.set(baseData, meta);
    apiCtx.metaMap.set(meta.proxyVal, meta);
    return meta;
  }
  function shouldGenerateProxyItems(parentType, key) {
    // !!! 对于 Array，直接生成 proxyItems
    if (parentType === ARRAY) return true;
    const fnKeys = PROXYITEM_FNKEYS[parentType] || [];
    return fnKeys.includes(key);
  }
  function getMayProxiedVal(val, options) {
    const { key, parentMeta, parent, parentType, fastModeRange, readOnly, apiCtx } = options;
    let curVal = val;
    // keep copy always same with self when readOnly = true
    if (readOnly && parentMeta && !isFn(val)) {
      const { copy, self } = parentMeta;
      const latestVal = self[key];
      if (curVal !== latestVal) {
        const meta = apiCtx.metaMap.get(curVal);
        if (meta) {
          apiCtx.metaMap.delete(curVal);
          apiCtx.metaMap.delete(meta.proxyVal);
        }
        copy[key] = latestVal;
        curVal = latestVal;
      }
    }
    const mayCreateProxyVal = (val, inputKey) => {
      const key = inputKey || '';
      if (isPrimitive(val) || !val) {
        return val;
      }
      if (!parentMeta) {
        throw new Error('[[ createMeta ]]: meta should not be null');
      }
      if (!isFn(val)) {
        if (
          // 是一个全新的节点，不必生成代理，以便提高性能
          parentMeta.newNodeStats[key] ||
          // 已被 markRaw 标记，不需转为代理
          val[IS_RAW]
        ) {
          return val;
        }
        let valMeta = getSafeDraftMeta(val, apiCtx);
        // 惰性生成代理对象和其元数据
        if (!valMeta) {
          valMeta = createScopedMeta(key, val, options);
          recordVerScope(valMeta);
          // child value 指向 copy
          if (parentMeta.selfType === MAP) {
            parent.set(key, valMeta.copy);
          } else {
            parent[key] = valMeta.copy;
          }
        }
        return valMeta.proxyVal;
      }
      if (!shouldGenerateProxyItems(parentType, key)) {
        return val;
      }
      if (parentMeta.proxyItems) {
        return val;
      }
      // 提前完成遍历，为所有 item 生成代理
      let proxyItems = [];
      if (parentType === SET) {
        const tmp = new Set();
        parent.forEach((val) => tmp.add(mayCreateProxyVal(val)));
        replaceSetOrMapMethods(tmp, parentMeta, {
          dataType: SET,
          apiCtx,
        });
        proxyItems = attachMeta(tmp, parentMeta, { fast: fastModeRange, apiCtx });
        // 区别于 2.0.2 版本，这里提前把 copy 指回来
        parentMeta.copy = proxyItems;
      } else if (parentType === MAP) {
        const tmp = new Map();
        parent.forEach((val, key) => tmp.set(key, mayCreateProxyVal(val, key)));
        replaceSetOrMapMethods(tmp, parentMeta, {
          dataType: MAP,
          apiCtx,
        });
        proxyItems = attachMeta(tmp, parentMeta, { fast: fastModeRange, apiCtx });
        // 区别于 2.0.2 版本，这里提前把copy指回来
        parentMeta.copy = proxyItems;
      } else if (parentType === ARRAY && key !== 'sort') {
        parentMeta.copy = parentMeta.copy || parent.slice();
        proxyItems = parentMeta.proxyVal;
      }
      parentMeta.proxyItems = proxyItems;
      return val;
    };
    return mayCreateProxyVal(curVal, key);
  }
  function getUnProxyValue(value, apiCtx) {
    if (!isObject(value)) {
      return value;
    }
    const valueMeta = getSafeDraftMeta(value, apiCtx);
    if (!valueMeta) return value;
    return valueMeta.copy;
  }
  /**
   * 拦截 set delete clear add
   * 支持用户使用 callback 的第三位参数 (val, key, mapOrSet) 的 mapOrSet 当做 draft 使用
   */
  function replaceSetOrMapMethods(mapOrSet, meta, options) {
    const { dataType, apiCtx } = options;
    // 拦截 set delete clear add，注意 set，add 在末尾判断后添加
    // 支持用户使用 callback 的第三位参数 (val, key, map) 的 map 当做 draft 使用
    const oriDel = mapOrSet.delete.bind(mapOrSet);
    const oriClear = mapOrSet.clear.bind(mapOrSet);
    mapOrSet.delete = function limuDelete(...args) {
      markModified(meta);
      return oriDel(...args);
    };
    mapOrSet.clear = function limuClear(...args) {
      markModified(meta);
      return oriClear(...args);
    };
    if (dataType === SET) {
      const oriAdd = mapOrSet.add.bind(mapOrSet);
      mapOrSet.add = function limuAdd(...args) {
        markModified(meta);
        return oriAdd(...args);
      };
    }
    if (dataType === MAP) {
      const oriSet = mapOrSet.set.bind(mapOrSet);
      const oriGet = mapOrSet.get.bind(mapOrSet);
      mapOrSet.set = function limuSet(...args) {
        markModified(meta);
        if (meta.hasOnOperate) {
          const value = args[1];
          meta.rootMeta.execOnOperate('set', args[0], { mayProxyVal: value, value, parentMeta: meta });
        }
        // @ts-ignore
        return oriSet(...args);
      };
      mapOrSet.get = function limuGet(...args) {
        const mayProxyVal = oriGet(...args);
        if (meta.hasOnOperate) {
          const draftMeta = getDraftMeta(mayProxyVal, apiCtx);
          const value = draftMeta ? draftMeta.copy || draftMeta.self : mayProxyVal;
          meta.rootMeta.execOnOperate('get', args[0], { mayProxyVal, value, parentMeta: meta, isChanged: false });
        }
        return mayProxyVal;
      };
    }
  }

  function mayMarkModified(options) {
    const { calledBy, parentMeta, op, parentType } = options;
    // 对于由 set 陷阱触发的 handleDataNode 调用，需要替换掉爷爷数据节点 key 指向的 value
    if (
      ['deleteProperty', 'set'].includes(calledBy) ||
      (calledBy === 'get' &&
        ((parentType === SET && SHOULD_REASSIGN_SET_METHODS.includes(op)) || // 针对 Set.add
          (parentType === ARRAY && SHOULD_REASSIGN_ARR_METHODS.includes(op)) || // 针对 Array 一系列的改变操作
          (parentType === MAP && SHOULD_REASSIGN_MAP_METHODS.includes(op)))) // 针对 Map 一系列的改变操作
    ) {
      markModified(parentMeta);
    }
  }
  function getValPathKey(parentMeta, key) {
    const pathCopy = parentMeta.keyPath.slice();
    pathCopy.push(key);
    const valPathKey = pathCopy.join('|');
    return valPathKey;
  }
  function handleDataNode(parentDataNode, copyCtx) {
    const { op, key, value: mayProxyValue, calledBy, parentType, parentMeta, apiCtx, isValueDraft } = copyCtx;
    /**
     * 防止 value 本身就是一个 Proxy
     * var draft_a1_b = draft.a1.b;
     * draft.a2 = draft_a1_b;
     */
    const value = getUnProxyValue(mayProxyValue, apiCtx);
    /**
     * 链路断裂，此对象未被代理
     * // draft = { a: { b: { c: 1 } }};
     * const newData = { n1: { n2: 2 } };
     * draft.a = newData;
     * draft.a.n1.n2 = 888; // 此时 n2_DataNode 是未代理对象
     */
    if (!parentMeta) {
      parentDataNode[key] = value;
      return;
    }
    const { self, copy: parentCopy } = parentMeta;
    mayMarkModified({ calledBy, parentMeta, op, key, parentType });
    // 是 Map, Set, Array 类型的方法操作或者值获取
    const fnKeys = CAREFUL_FNKEYS[parentType] || [];
    // 是函数调用
    if (isFn(mayProxyValue) && fnKeys.includes(op)) {
      // slice 操作无需使用 copy，返回自身即可
      if ('slice' === op) {
        return self.slice;
      }
      if (CHANGE_ARR_ORDER_METHODS.includes(op)) {
        parentMeta.isArrOrderChanged = true;
      }
      if (parentCopy) {
        // 因为 Map 和 Set 里的对象不能直接操作修改，是通过 set 调用来修改的
        // 所以无需 bind(parentDataNodeMeta.proxyVal)， 否则会以下情况出现，
        // Method Map.prototype.forEach called on incompatible receiver
        // Method Set.prototype.forEach called on incompatible receiver
        // see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Called_on_incompatible_type
        if (parentType === SET || parentType === MAP) {
          // 注意 forEach 等方法已提前生成了 proxyItems，这里 bind 的目标优先取 proxyItems
          return parentCopy[op].bind(parentCopy);
        }
        return parentCopy[op];
      }
      return self[op].bind(self);
    }
    if (!parentCopy) {
      return value;
    }
    const oldValue = parentCopy[key];
    const tryMarkDel = () => {
      const oldValueMeta = getDraftMeta(oldValue, apiCtx);
      oldValueMeta && (oldValueMeta.isDel = true);
    };
    const tryMarkUndel = () => {
      const valueMeta = getDraftMeta(mayProxyValue, apiCtx);
      if (valueMeta && valueMeta.isDel) {
        valueMeta.isDel = false;
        valueMeta.key = key;
        valueMeta.keyPath = parentMeta.keyPath.concat([key]);
        valueMeta.level = parentMeta.level + 1;
        valueMeta.parent = parentMeta.copy;
        valueMeta.parentMeta = parentMeta;
      }
    };
    if (calledBy === 'deleteProperty') {
      const valueMeta = getDraftMeta(mayProxyValue, apiCtx);
      // for test/complex/data-node-change case3
      if (valueMeta) {
        valueMeta.isDel = true;
      } else {
        // for test/complex/data-node-change (node-change 2)
        tryMarkDel();
      }
      const val = parentCopy[key];
      if (!isPrimitive(val)) {
        apiCtx.newNodeMap.delete(getValPathKey(parentMeta, key));
      }
      delete parentCopy[key];
      return;
    }
    // set 时非原始值都当做新节点记录下来
    if (!isValueDraft && !isPrimitive(value)) {
      parentMeta.newNodeStats[key] = true;
      apiCtx.newNodeMap.set(getValPathKey(parentMeta, key), { parent: parentCopy, node: value, key, target: null });
    }
    parentCopy[key] = value;
    // 谨防是 a.b = { ... } ---> a.b = 1 的变异赋值方式
    tryMarkDel();
    tryMarkUndel();
  }

  function deepFreeze$1(obj) {
    if (isPrimitive(obj)) {
      return obj;
    }
    // @ts-ignore
    if (Array.isArray(obj) && obj.length > 0) {
      obj.forEach(deepFreeze$1);
      return Object.freeze(obj);
    }
    if (isSet(obj)) {
      const set = obj;
      // TODO: throw error 'do not mutate' ?
      set.add = () => set;
      set.delete = () => false;
      set.clear = noop;
      // @ts-ignore
      for (const item of set.values()) {
        Object.freeze(item);
      }
      return Object.freeze(obj);
    }
    if (isMap(obj)) {
      const map = obj;
      // TODO: throw error 'do not mutate' ?
      map.set = () => map;
      map.delete = () => false;
      map.clear = noop;
      // @ts-ignore
      for (const item of map.values()) {
        Object.freeze(item);
      }
      return Object.freeze(obj);
    }
    // get all properties
    const propertyNames = Object.getOwnPropertyNames(obj);
    propertyNames.forEach((name) => {
      const value = obj[name];
      deepFreeze$1(value);
    });
    return Object.freeze(obj);
  }

  // 可直接返回的属性
  // 避免 Cannot set property size of #<Map> which has only a getter
  // 避免 Cannot set property size of #<Set> which has only a getter
  const PROPERTIES_BLACK_LIST = ['length', 'constructor', 'asymmetricMatch', 'nodeType', 'size'];
  const PBL_DICT = {}; // for perf
  PROPERTIES_BLACK_LIST.forEach((item) => (PBL_DICT[item] = 1));
  const TYPE_BLACK_DICT = { [ARRAY]: 1, [SET]: 1, [MAP]: 1 }; // for perf
  const FINISH_HANDLER_MAP = new Map();
  function buildLimuApis(options) {
    var _a, _b, _c, _d, _e, _f, _g;
    const opts = options || {};
    const onOperate = opts.onOperate;
    const hasOnOperate = !!onOperate;
    const customKeys = opts.customKeys || [];
    const fastModeRange = opts.fastModeRange || conf.fastModeRange;
    // @ts-ignore
    const immutBase = (_a = opts[IMMUT_BASE]) !== null && _a !== void 0 ? _a : false;
    const readOnly = (_b = opts.readOnly) !== null && _b !== void 0 ? _b : false;
    const disableWarn = opts.disableWarn;
    const compareVer = (_c = opts.compareVer) !== null && _c !== void 0 ? _c : false;
    const debug = (_d = opts.debug) !== null && _d !== void 0 ? _d : false;
    // 调用那一刻起，确定 autoFreeze 值
    // allow user overwrite autoFreeze setting in current call process
    const autoFreeze = (_e = opts.autoFreeze) !== null && _e !== void 0 ? _e : conf.autoFreeze;
    // 暂未实现 to be implemented in the future
    const metaVer = genMetaVer();
    const apiCtx = { metaMap: new Map(), newNodeMap: new Map(), debug, metaVer };
    ROOT_CTX.set(metaVer, apiCtx);
    const autoRevoke = (_f = opts.autoRevoke) !== null && _f !== void 0 ? _f : conf.autoRevoke;
    const silenceSetTrapErr = (_g = opts.silenceSetTrapErr) !== null && _g !== void 0 ? _g : true;
    const logChangeFailed = (op, key) => {
      console.warn(`${op} ${key} failed, cuase draft root has been finised!`);
      return silenceSetTrapErr;
    };
    let isDraftFinished = false;
    const warnReadOnly = () => {
      if (!disableWarn) {
        console.warn('can not mutate state at readOnly mode!');
      }
      return true;
    };
    const execOnOperate = (op, key, options) => {
      const { mayProxyVal, parentMeta: inputPMeta, value, isCustom = false } = options;
      let isChanged = false;
      if (!onOperate) return { isChanged, mayProxyVal };
      const parentMeta = inputPMeta || {};
      const { selfType = '', keyPath = [], copy, self, modified, proxyVal: parentProxy } = parentMeta || {};
      let isBuiltInFnKey = false;
      // 优先采用显式传递的 isChange
      if (options.isChanged !== undefined) {
        isChanged = options.isChanged;
      } else {
        const fnKeys = CAREFUL_FNKEYS[selfType] || [];
        if (fnKeys.includes(key)) {
          isBuiltInFnKey = true;
          const changeFnKeys = CHANGE_FNKEYS[selfType] || [];
          isChanged = changeFnKeys.includes(key);
        } else if (op !== 'get') {
          // 变化之后取 copy 比较
          const node = modified ? copy : self;
          isChanged = inputPMeta ? node[key] !== value : true;
        }
      }
      let replacedValue = null;
      let isReplaced = false;
      const replaceValue = (value) => {
        isReplaced = true;
        replacedValue = value;
      };
      const getReplaced = () => ({ isReplaced, replacedValue });
      onOperate({
        immutBase,
        parent: self,
        parentType: selfType,
        parentProxy,
        op,
        replaceValue,
        getReplaced,
        isBuiltInFnKey,
        isChanged,
        isCustom,
        key,
        keyPath,
        fullKeyPath: keyPath.concat(key),
        value,
        proxyValue: mayProxyVal,
      });
      return {
        mayProxyVal: isReplaced ? replacedValue : mayProxyVal,
        isChanged,
      };
    };
    const limuApis = (() => {
      // let revoke: null | (() => void) = null;
      /**
       * 为了和下面这个 immer case 保持行为一致
       * https://github.com/immerjs/immer/issues/960
       * 如果数据节点上人工赋值了其他 draft 的话，当前 draft 结束后不能够被冻结（ 见set逻辑 ）
       */
      let canFreezeDraft = true;
      // >= 3.0+ ver, shadow copy on read, mark modified on write
      const limuTraps = {
        // parent指向的是代理之前的对象
        get: (parent, key) => {
          if (META_VER === key) {
            return metaVer;
          }
          /** current child value, it may been replaced to a proxy value later */
          const currentVal = parent[key];
          if (JS_SYM_KEYS.includes(key)) {
            // 避免报错 Method xx.yy called on incompatible receiver
            // 例如 Array.from(draft)
            if (isFn(currentVal)) {
              // 执行 for(const item of list){ ... } 语句
              if (Symbol.iterator === key && Array.isArray(parent)) {
                let idx = 0;
                // 模拟迭代器
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol
                const iter = () => ({
                  next: () => {
                    const len = parent.length;
                    if (len === 0) {
                      return { done: true, value: undefined };
                    }
                    // 前一次迭代已到达最后一个元素时，idx === len
                    const done = idx === len;
                    // key 格式统一为字符串，故这里包一层 String
                    const value = done ? undefined : limuTraps.get(parent, String(idx));
                    idx++;
                    return { done, value };
                  },
                  [Symbol.iterator]: () => {
                    return iter;
                  },
                });
                return iter;
              }
              return currentVal.bind(parent);
            }
            return currentVal;
          }
          // 判断 toJSON 是为了兼容 JSON.stringify 调用, https://javascript.info/json#custom-tojson
          if (key === '__proto__' || (key === 'toJSON' && !has(parent, key))) {
            return currentVal;
          }
          let mayProxyVal = currentVal;
          const parentMeta = getSafeDraftMeta(parent, apiCtx);
          if (customKeys.includes(key)) {
            const ret = execOnOperate('get', key, { parentMeta, mayProxyVal, value: currentVal, isChanged: false, isCustom: true });
            return ret.mayProxyVal;
          }
          const parentType = parentMeta === null || parentMeta === void 0 ? void 0 : parentMeta.selfType;
          // copyWithin、sort 、valueOf... will hit the keys of 'asymmetricMatch', 'nodeType',
          // PROPERTIES_BLACK_LIST 里 'length', 'constructor', 'asymmetricMatch', 'nodeType'
          if (TYPE_BLACK_DICT[parentType] && PBL_DICT[key]) {
            if (key === 'length' || key === 'size') {
              execOnOperate('get', key, { parentMeta, mayProxyVal, value: currentVal });
            }
            return parentMeta.copy[key];
          }
          // 可能会指向代理对象
          mayProxyVal = getMayProxiedVal(currentVal, {
            key,
            compareVer,
            parentMeta,
            parentType,
            ver: metaVer,
            traps: limuTraps,
            parent,
            fastModeRange,
            immutBase,
            readOnly,
            apiCtx,
            hasOnOperate,
            autoRevoke,
          });
          // 用下标取数组时，可直接返回
          // 例如数组操作: arrDraft[0].xxx = 'new'， 此时 arrDraft[0] 需要操作的是代理对象
          if (parentType === ARRAY && canBeNum(key)) {
            const ret = execOnOperate('get', key, { parentMeta, mayProxyVal, value: currentVal });
            return ret.mayProxyVal;
          }
          // @ts-ignore
          if (CAREFUL_TYPES[parentType]) {
            mayProxyVal = handleDataNode(parent, {
              op: key,
              key,
              value: currentVal,
              metaVer,
              calledBy: 'get',
              parentType,
              parentMeta,
              apiCtx,
            });
            const ret = execOnOperate('get', key, { parentMeta, mayProxyVal, value: currentVal });
            return ret.mayProxyVal;
          }
          const ret = execOnOperate('get', key, { parentMeta, mayProxyVal, value: currentVal });
          return ret.mayProxyVal;
        },
        // parent 指向的是代理之前的对象
        set: (parent, key, value) => {
          if (isDraftFinished) {
            return logChangeFailed('set', key);
          }
          const parentMeta = getSafeDraftMeta(parent, apiCtx);
          // fix issue https://github.com/tnfe/limu/issues/12
          let isValueDraft = false;
          // is a draft proxy node
          if (isDraft$1(value)) {
            isValueDraft = true;
            // see case debug/complex/set-draft-node
            if (isInSameScope(value, metaVer)) {
              const rawValue = getUnProxyValue(value, apiCtx);
              if (rawValue === parent[key]) {
                return true;
              }
            } else {
              // TODO: judge value must be a root draft node
              // assign another scope draft node to current scope
              canFreezeDraft = false;
            }
          }
          if (readOnly) {
            execOnOperate('set', key, { parentMeta, isChanged: false, value });
            return warnReadOnly();
          }
          // speed up array operation
          if (parentMeta && parentMeta.selfType === ARRAY) {
            // @ts-ignore
            if (parentMeta.copy && parentMeta.__callSet && canBeNum(key)) {
              execOnOperate('set', key, { parentMeta, value });
              parentMeta.copy[key] = value;
              return true;
            }
            // @ts-ignore, mark is set called on parent node
            parentMeta.__callSet = true;
          }
          let isChanged = false;
          if (!onOperate) {
            // 变化之后取 copy 比较
            const node = parentMeta.modified ? parentMeta.copy : parentMeta.self;
            isChanged = node[key] !== value;
          } else {
            const ret = execOnOperate('set', key, { parentMeta, value });
            isChanged = ret.isChanged;
          }
          if (isChanged) {
            handleDataNode(parent, {
              parentMeta,
              key,
              value,
              metaVer,
              calledBy: 'set',
              apiCtx,
              isValueDraft,
            });
          }
          return true;
        },
        // delete or Reflect.deleteProperty will trigger this trap
        deleteProperty: (parent, key) => {
          if (isDraftFinished) {
            return logChangeFailed('set', key);
          }
          const parentMeta = getSafeDraftMeta(parent, apiCtx);
          const value = parent[key];
          if (readOnly) {
            execOnOperate('del', key, { parentMeta, isChanged: false, value });
            return warnReadOnly();
          }
          execOnOperate('del', key, { parentMeta, isChanged: true, value });
          handleDataNode(parent, {
            parentMeta,
            op: 'del',
            key,
            value: '',
            metaVer,
            calledBy: 'deleteProperty',
            apiCtx,
          });
          return true;
        },
        // trap function call
        apply: function (target, thisArg, args) {
          return target.apply(thisArg, args);
        },
      };
      return {
        createDraft: (mayDraft) => {
          if (isPrimitive(mayDraft)) {
            throw new Error('base state can not be primitive');
          }
          let oriBase = mayDraft;
          const draftMeta = getSafeDraftMeta(mayDraft, apiCtx);
          if (draftMeta) {
            // 总是返回同一个 immutBase 代理对象
            if (immutBase && draftMeta.isImmutBase) {
              return draftMeta.proxyVal;
            }
            oriBase = draftMeta.self;
          }
          const meta = createScopedMeta('', oriBase, {
            ver: metaVer,
            traps: limuTraps,
            immutBase,
            readOnly,
            compareVer,
            apiCtx,
            hasOnOperate,
            autoRevoke,
          });
          recordVerScope(meta);
          meta.execOnOperate = execOnOperate;
          FINISH_HANDLER_MAP.set(meta.proxyVal, limuApis.finishDraft);
          return meta.proxyVal;
        },
        finishDraft: (proxyDraft) => {
          // attention: if pass a revoked proxyDraft
          // it will throw: Cannot perform 'set' on a proxy that has been revoked
          const rootMeta = getSafeDraftMeta(proxyDraft, apiCtx);
          if (!rootMeta) {
            throw new Error('rootMeta should not be null!');
          }
          if (rootMeta.level !== 0) {
            throw new Error('can not finish sub draft node!');
          }
          // TODO support fastCopy
          // immutBase 是一个一直可用的对象
          // 对 immut() 返回的对象调用 finishDraft 则总是返回 immutBase 自身代理
          // 将 immut() 返回结果传给 finishDraft 是无意义的
          if (rootMeta.isImmutBase) {
            return proxyDraft;
          }
          let final = extractFinalData(rootMeta, apiCtx);
          if (autoFreeze && canFreezeDraft) {
            // TODO deep pruning
            // see https://github.com/immerjs/immer/issues/687
            // let cachedFrozenOriginalBase = frozenOriginalBaseMap.get(rootMeta.originalSelf);
            final = deepFreeze$1(final);
          }
          ROOT_CTX.delete(metaVer);
          isDraftFinished = true;
          return final;
        },
      };
    })();
    return limuApis;
  }

  /*---------------------------------------------------------------------------------------------
   *  Licensed under the MIT License.
   *
   *  @Author: fantasticsoul
   *--------------------------------------------------------------------------------------------*/
  function original$1(mayDraftProxy) {
    const meta = getDraftMeta(mayDraftProxy);
    // use ternary conditional operator instead of meta?.self
    // avoid generating redundant compiled code
    const self = meta ? meta.self : mayDraftProxy;
    return self;
  }
  function current$1(mayDraftProxy) {
    const meta = getDraftMeta(mayDraftProxy);
    if (!meta) {
      return mayDraftProxy;
    }
    return deepCopy$1(meta.copy || meta.self);
  }
  function markRaw$1(rawVal) {
    if (!rawVal || isPrimitive(rawVal)) return rawVal;
    rawVal[IS_RAW] = true;
    return rawVal;
  }

  /*---------------------------------------------------------------------------------------------
   *  Licensed under the MIT License.
   *
   *  @Author: fantasticsoul
   *--------------------------------------------------------------------------------------------*/
  // isDraft isDiff shallowCompare 高频使用的从顶层暴露，其他随 limuUtils 里暴露
  /**
   * 判断是否是草稿
   * @see https://tnfe.github.io/limu/docs/api/basic/limu-utils#isdraft
   */
  const isDraft = isDraft$1;
  /**
   * 判断两个值是否相同
   * @see https://tnfe.github.io/limu/docs/api/basic/limu-utils#isdiff
   */
  const isDiff = isDiff$1;
  /**
   * 浅比较两个对象是否相同
   * @see https://tnfe.github.io/limu/docs/api/basic/limu-utils#shallowcompare
   */
  const shallowCompare = shallowCompare$1;
  /**
   * 内部工具函数集合，写为如下格式会降低覆盖率，故导入后再导出
   * ```txt
   * import * as limuUtils; from './support/util';
   * const { isFn, isPromiseFn, isPromiseResult } = limuUtils;;
   * export { limuUtils; };
   * ```
   */
  const limuUtils = {
    has,
    noop,
    isObject,
    isMap,
    isSet,
    isFn,
    isPrimitive,
    isPromiseFn,
    isPromiseResult,
    isSymbol,
    isMardedRaw,
    canBeNum,
    isDraft,
    isDiff,
    shallowCompare,
    getDraftMeta,
    getDataType,
  };
  // export interface IProduceWithPatches {
  //   <T = ObjectLike>(baseState: T, cb: ProduceCb<T>, options?: ICreateDraftOptions): any[];
  // }
  /** limu 的版本号 */
  const VER = VER$1;
  /**
   * 创建草稿函数，可对返回的草稿对象直接修改，此修改不会影响原始对象
   * @see https://tnfe.github.io/limu/docs/api/basic/create-draft
   */
  function createDraft(base, options) {
    const apis = buildLimuApis(options);
    // @ts-ignore add [as] just for click to see implement
    return apis.createDraft(base);
  }
  /**
   * 结束草稿的函数，生成的新对象和原始对象会结构共享
   * @see https://tnfe.github.io/limu/docs/api/basic/create-draft
   */
  function finishDraft(draft) {
    const finishHandler = FINISH_HANDLER_MAP.get(draft);
    if (!finishHandler) {
      throw new Error(`Not a Limu root draft or draft has been finished!`);
    }
    FINISH_HANDLER_MAP.delete(draft);
    return finishHandler(draft);
  }
  function checkCbFn(cb) {
    if (!isFn(cb)) {
      throw new Error('produce callback is not a function');
    }
  }
  // see issue https://github.com/tnfe/limu/issues/5
  function checkCbPromise(cb, result) {
    if (isPromiseFn(cb) || isPromiseResult(result)) {
      throw new Error('produce callback can not be a promise function or result');
    }
  }
  function innerProduce(baseState, cb, options) {
    checkCbFn(cb);
    const draft = createDraft(baseState, options);
    const result = cb(draft);
    checkCbPromise(cb, result);
    return finishDraft(draft);
  }
  function produceFn(baseState, cb, options) {
    if (!cb || !isFn(cb)) {
      // expect baseState to be a callback, support curried invocation
      // expect cb to be options
      const mayCb = baseState;
      const mayOptions = cb;
      checkCbFn(baseState);
      return (state) => {
        return innerProduce(state, mayCb, mayOptions);
      };
    }
    return innerProduce(baseState, cb, options);
  }
  /**
   * ```ts
   * // normal use:
   * const next = produce(draft=>draft.a=1);
   *
   * // use in react:
   * setState(produce(draft=>{
   *    draft.name = 2;
   * }));
   * ```
   */
  const produce = produceFn;
  // to be implemented in the future
  // export const produceWithPatches = producePatchesFn as unknown as IProduceWithPatches;
  /**
   * 深冻结传入的值，返回的是冻结后的新值，如传入原始值则不做任何操作，原样返回
   */
  const deepFreeze = deepFreeze$1;
  /**
   * 对传入值做深克隆，返回的是克隆后的新值，如传入原始值则不做任何操作，原样返回
   */
  function deepCopy(obj) {
    return deepCopy$1(obj);
  }
  /**
   * 生成一个不可修改的对象im，但原始对象的修改将同步会影响到im
   * immut 采用了读时浅代理的机制，相比deepFreeze会拥有更好性能，适用于不暴露原始对象出去，只暴露生成的不可变对象出去的场景
   * @see: https://tnfe.github.io/limu/docs/api/basic/immut
   */
  function immut(base, options) {
    const limuApis = buildLimuApis(Object.assign(Object.assign({}, options || {}), { readOnly: true, [IMMUT_BASE]: true }));
    const immutData = limuApis.createDraft(base);
    return immutData;
  }
  /**
   * 设置全局冻结配置，可在 createDraft, produce 时二次覆盖此全局配置
   */
  function setAutoFreeze(autoFreeze) {
    conf.autoFreeze = autoFreeze;
  }
  /**
   * 获取全局设置的 autoFreeze 值
   */
  function getAutoFreeze() {
    return conf.autoFreeze;
  }
  /**
   * 查看草稿对应的原始值
   */
  const original = original$1;
  /**
   * 标记对象为 raw，此对象再次被复用时不会被代理，需注意标为 raw 后此对象会失去结构共享特性
   */
  const markRaw = markRaw$1;
  /**
   * 导出草稿的副本数据（ 即深克隆当前草稿 ）
   */
  const current = current$1;
  // disable [export default], let esModuleInterop=true, allowSyntheticDefaultImports=true works in tsconfig.json
  // export default produce;

  exports.VER = VER;
  exports.createDraft = createDraft;
  exports.current = current;
  exports.deepCopy = deepCopy;
  exports.deepFreeze = deepFreeze;
  exports.finishDraft = finishDraft;
  exports.getAutoFreeze = getAutoFreeze;
  exports.immut = immut;
  exports.isDiff = isDiff;
  exports.isDraft = isDraft;
  exports.limuUtils = limuUtils;
  exports.markRaw = markRaw;
  exports.original = original;
  exports.produce = produce;
  exports.setAutoFreeze = setAutoFreeze;
  exports.shallowCompare = shallowCompare;

  Object.defineProperty(exports, '__esModule', { value: true });
});
