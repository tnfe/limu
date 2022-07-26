(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.limu = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var _a, _b, _c;
    var MAP = 'Map';
    var SET = 'Set';
    var ARRAY = 'Array';
    var OBJECT = 'Object';
    var carefulDataTypes = { Map: MAP, Set: SET, Array: ARRAY };
    var objDesc = '[object Object]';
    var mapDesc = '[object Map]';
    var setDesc = '[object Set]';
    var arrDesc = '[object Array]';
    var fnDesc = '[object Function]';
    var desc2dataType = (_a = {},
        _a[mapDesc] = MAP,
        _a[setDesc] = SET,
        _a[arrDesc] = ARRAY,
        _a[objDesc] = OBJECT,
        _a);
    var SHOULD_REASSIGN_ARR_METHODS = ['push', 'pop', 'shift', 'splice', 'unshift', 'reverse', 'copyWithin', 'delete', 'fill'];
    var SHOULD_REASSIGN_MAP_METHODS = ['clear', 'delete', 'set'];
    var SHOULD_REASSIGN_SET_METHODS = ['add', 'clear', 'delete'];
    var arrFnKeys = [
        'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'flat', 'flatMap',
        'forEach', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf', 'map', 'pop', 'push', 'reduce', 'reduceRight',
        'reverse', 'shift', 'unshift', 'slice', 'some', 'sort', 'splice', 'values', 'valueOf',
    ];
    var mapFnKeys = ['clear', 'delete', 'entries', 'forEach', 'get', 'has', 'keys', 'set', 'values'];
    var setFnKeys = ['add', 'clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values'];
    var mapIgnoreFnKeys = [
        // 'forEach', 'get',
        'entries', 'keys', 'values', 'has',
    ];
    __spreadArray(__spreadArray([], mapIgnoreFnKeys, true), [
        'size',
    ], false);
    var setIgnoreFnKeys = [
        // 'forEach',
        'entries', 'has', 'keys', 'values'
    ];
    // export const setIgnoreFnKeys = ['entries', 'has', 'keys', 'values'];
    __spreadArray(__spreadArray([], setIgnoreFnKeys, true), [
        'size',
    ], false);
    var carefulFnKeys = (_b = {},
        _b[carefulDataTypes.Map] = mapFnKeys,
        _b[carefulDataTypes.Set] = setFnKeys,
        _b[carefulDataTypes.Array] = arrFnKeys,
        _b);
    var proxyItemFnKeys = (_c = {},
        _c[carefulDataTypes.Map] = ['forEach', 'get'],
        _c[carefulDataTypes.Set] = ['forEach'],
        _c[carefulDataTypes.Array] = ['forEach', 'map'],
        _c);

    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Tencent Corporation. All rights reserved.
     *  Licensed under the MIT License.
     *
     *  @Author: fantasticsoul
     *--------------------------------------------------------------------------------------------*/
    var toString = Object.prototype.toString;
    function noop() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args;
    }
    function isObject(val) {
        // attention，null desc is '[object Null]'
        return toString.call(val) === objDesc;
    }
    function isMap(val) {
        return toString.call(val) === mapDesc;
    }
    function isSet(val) {
        return toString.call(val) === setDesc;
    }
    function isFn(val) {
        return toString.call(val) === fnDesc;
    }
    function getValStrDesc(val) {
        return toString.call(val);
    }
    function getDataType(dataNode) {
        var strDesc = getValStrDesc(dataNode);
        var dataType = desc2dataType[strDesc];
        return dataType;
    }
    function isPrimitive(val) {
        var desc = toString.call(val);
        return ![objDesc, arrDesc, mapDesc, setDesc, fnDesc].includes(desc);
    }
    function isPromiseFn(obj) {
        return obj.constructor.name === 'AsyncFunction' || 'function' === typeof obj.then;
    }
    function isPromiseResult(result) {
        return typeof Promise !== "undefined" && result instanceof Promise;
    }
    function canBeNum(val) {
        var valType = typeof val;
        if (valType === 'number')
            return true;
        if (valType === 'string')
            return /^[0-9]*$/.test(val);
        return false;
    }
    function isSymbol(maySymbol) {
        return typeof maySymbol === 'symbol';
    }

    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Tencent Corporation. All rights reserved.
     *  Licensed under the MIT License.
     *
     *  @Author: fantasticsoul
     *--------------------------------------------------------------------------------------------*/
    // 用于验证 proxyDraft 和 finishDraft 函数 是否能够匹配
    var META_KEY = Symbol('M');

    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Tencent Corporation. All rights reserved.
     *  Licensed under the MIT License.
     *
     *  @Author: fantasticsoul
     *--------------------------------------------------------------------------------------------*/
    var verWrap = { value: 0, usablePrefix: 1 };
    var limuConfig = {
        autoFreeze: true,
        usePatches: false,
    };

    function markModified(meta) {
        meta.rootMeta.modified = true;
        var doMark = function (meta) {
            if (meta) {
                meta.modified = true;
                doMark(meta.parentMeta);
            }
        };
        doMark(meta);
    }
    function attachMeta(dataNode, meta) {
        dataNode[META_KEY] = meta;
        return dataNode;
    }
    function getKeyPath(draftNode, curKey) {
        var pathArr = [curKey];
        var meta = getDraftMeta$1(draftNode);
        if (meta && meta.level > 0) {
            var keyPath = meta.keyPath;
            return __spreadArray(__spreadArray([], keyPath, true), [curKey], false);
        }
        return pathArr;
    }
    function newMeta(baseData, options) {
        var finishDraft = options.finishDraft, ver = options.ver, _a = options.parentMeta, parentMeta = _a === void 0 ? null : _a, key = options.key;
        var dataType = getDataType(baseData);
        var keyPath = [];
        var level = 0;
        var copy = null;
        if (parentMeta) {
            copy = parentMeta.copy;
            level = getNextMetaLevel(copy);
            keyPath = getKeyPath(copy, key);
        }
        var meta = {
            // @ts-ignore add later
            rootMeta: null,
            parentMeta: parentMeta,
            parent: copy,
            selfType: dataType,
            self: baseData,
            // @ts-ignore add later
            copy: null,
            key: key,
            keyPath: keyPath,
            level: level,
            // @ts-ignore add later
            proxyVal: null,
            proxyItems: null,
            modified: false,
            scopes: [],
            finishDraft: finishDraft,
            ver: ver,
            revoke: noop,
        };
        if (level === 0) {
            meta.rootMeta = meta;
        }
        else {
            meta.rootMeta = parentMeta.rootMeta;
        }
        return meta;
    }
    /**
     * 是否是 proxy 代理指向的草稿对象
     * @param mayDraft
     * @returns
     */
    function isDraft$1(mayDraft) {
        if (isPrimitive(mayDraft)) {
            return false;
        }
        var meta = mayDraft[META_KEY];
        return !!meta;
    }
    function genMetaVer() {
        if (verWrap.value >= Number.MAX_SAFE_INTEGER) {
            verWrap.value = 1;
            verWrap.usablePrefix += 1;
        }
        else {
            verWrap.value += 1;
        }
        var value = verWrap.value, usablePrefix = verWrap.usablePrefix;
        var metaVer = "".concat(usablePrefix, "_").concat(value);
        return metaVer;
    }
    function getNextMetaLevel(mayContainMetaObj) {
        var meta = getDraftMeta$1(mayContainMetaObj);
        return meta ? meta.level + 1 : 1;
    }
    function getDraftMeta$1(proxyDraft) {
        return proxyDraft[META_KEY];
    }

    function deepCopy$1(obj, metaVer) {
        var innerDeep = function (obj) {
            if (isPrimitive(obj)) {
                return obj;
            }
            if (metaVer) {
                var meta = getDraftMeta$1(obj);
                var copy = meta === null || meta === void 0 ? void 0 : meta.copy;
                // 多引用导致的遗漏值，还原回来，此处注意跳过根对象判定
                if (copy && meta.level > 0) {
                    return copy;
                }
            }
            var newNode = obj;
            if (Array.isArray(obj)) {
                newNode = obj.slice();
                newNode.forEach(function (item, idx) {
                    newNode[idx] = innerDeep(item);
                });
            }
            if (isSet(obj)) {
                var tmpArr_1 = Array.from(obj);
                tmpArr_1.forEach(function (item, idx) {
                    tmpArr_1[idx] = innerDeep(item);
                });
                newNode = new Set(tmpArr_1);
            }
            if (isMap(obj)) {
                newNode = new Map(obj);
                newNode.forEach(function (value, key) {
                    newNode.set(key, innerDeep(value));
                });
            }
            if (isObject(obj)) {
                newNode = {};
                Object.keys(obj).forEach(function (key) {
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
    function tryMakeCopy(val, throwErr) {
        if (Array.isArray(val)) {
            return val.slice();
        }
        if (val && isObject(val)) {
            return __assign({}, val);
        }
        if (isMap(val)) {
            return new Map(val);
        }
        if (isSet(val)) {
            return new Set(val);
        }
        if (throwErr) {
            throw new Error("make copy err, type can only be object(except null) or array");
        }
        return val;
    }
    // 调用处已保证 meta 不为空 
    function makeCopyWithMeta(ori, meta) {
        var ret = tryMakeCopy(ori, true);
        return attachMeta(ret, meta);
    }

    function isInSameScope(mayDraftNode, callerScopeVer) {
        if (!isObject(mayDraftNode)) {
            return true;
        }
        var ret = getDraftMeta$1(mayDraftNode).ver === callerScopeVer;
        return ret;
    }
    function clearScopes(rootMeta) {
        rootMeta.scopes.forEach(function (meta) {
            var modified = meta.modified, copy = meta.copy, parentMeta = meta.parentMeta, key = meta.key, self = meta.self, revoke = meta.revoke, proxyVal = meta.proxyVal, isDel = meta.isDel;
            if (!copy)
                return revoke();
            delete copy[META_KEY];
            if (!parentMeta)
                return revoke();
            var targetNode = !modified ? self : copy;
            // 父节点是 Map、Set 时，parent 指向的是 ProxyItems，这里取到 copy 本体后再重新赋值
            var parentCopy = parentMeta.copy;
            var parentType = parentMeta.selfType;
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
                parentCopy[key] = targetNode;
                return revoke();
            }
            if (isDel !== true) {
                parentCopy[key] = targetNode;
                return revoke();
            }
        });
        rootMeta.scopes.length = 0;
    }
    function extraFinalData(rootMeta) {
        var self = rootMeta.self, copy = rootMeta.copy, modified = rootMeta.modified;
        var final = self;
        // 有 copy 不一定有修改行为，这里需做双重判断
        if (copy && modified) {
            final = rootMeta.copy;
        }
        // if put this on first line, fail at test/set-other/update-object-item.ts
        clearScopes(rootMeta);
        return final;
    }
    function recordVerScope(meta) {
        meta.rootMeta.scopes.push(meta);
    }

    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Tencent Corporation. All rights reserved.
     *  Licensed under the MIT License.
     *
     *  @Author: fantasticsoul
     *--------------------------------------------------------------------------------------------*/
    function createScopedMeta(baseData, options) {
        var _a = options.finishDraft, finishDraft = _a === void 0 ? noop : _a, ver = options.ver, traps = options.traps, parentMeta = options.parentMeta, key = options.key;
        var meta = newMeta(baseData, { finishDraft: finishDraft, ver: ver, parentMeta: parentMeta, key: key });
        var copy = makeCopyWithMeta(baseData, meta);
        meta.copy = copy;
        var ret = Proxy.revocable(copy, traps);
        meta.proxyVal = ret.proxy;
        meta.revoke = ret.revoke;
        return meta;
    }
    function shouldGenerateProxyItems(parentType, key) {
        // !!! 对于 Array，直接生成 proxyItems
        if (parentType === ARRAY)
            return true;
        var fnKeys = proxyItemFnKeys[parentType] || [];
        return fnKeys.includes(key);
    }
    function getProxyVal(selfVal, options) {
        var _a = options || {}, key = _a.key, parentMeta = _a.parentMeta, ver = _a.ver, traps = _a.traps, parent = _a.parent, patches = _a.patches, inversePatches = _a.inversePatches, usePatches = _a.usePatches, parentType = _a.parentType;
        var mayCreateProxyVal = function (selfVal, inputKey) {
            if (isPrimitive(selfVal) || !selfVal) {
                return selfVal;
            }
            var key = inputKey || '';
            var valMeta = getDraftMeta$1(selfVal);
            if (!isFn(selfVal)) {
                // 惰性生成代理对象和其元数据
                if (!valMeta) {
                    valMeta = createScopedMeta(selfVal, { key: key, parentMeta: parentMeta, ver: ver, traps: traps });
                    recordVerScope(valMeta);
                    // child value 指向 copy
                    parent[key] = valMeta.copy;
                }
                return valMeta.proxyVal;
            }
            if (!shouldGenerateProxyItems(parentType, key)) {
                return selfVal;
            }
            // valMeta = getDraftMeta(parent) as DraftMeta;
            if (!parentMeta) {
                throw new Error('[[ createMeta ]]: oops, meta should not be null');
            }
            if (parentMeta.proxyItems) {
                return selfVal;
            }
            // 提前完成遍历，为所有 item 生成代理
            var proxyItems = [];
            if (parentType === SET) {
                var tmp_1 = new Set();
                parent.forEach(function (val) { return tmp_1.add(mayCreateProxyVal(val)); });
                replaceSetOrMapMethods(tmp_1, parentMeta, { dataType: SET, patches: patches, inversePatches: inversePatches, usePatches: usePatches });
                proxyItems = attachMeta(tmp_1, parentMeta);
                // 区别于 2.0.2 版本，这里提前把copy指回来
                parentMeta.copy = proxyItems;
            }
            else if (parentType === MAP) {
                var tmp_2 = new Map();
                parent.forEach(function (val, key) { return tmp_2.set(key, mayCreateProxyVal(val, key)); });
                replaceSetOrMapMethods(tmp_2, parentMeta, { dataType: MAP, patches: patches, inversePatches: inversePatches, usePatches: usePatches });
                proxyItems = attachMeta(tmp_2, parentMeta);
                // 区别于 2.0.2 版本，这里提前把copy指回来
                parentMeta.copy = proxyItems;
            }
            else if (parentType === ARRAY) {
                parentMeta.copy = parentMeta.copy || parent.slice();
                proxyItems = parentMeta.proxyVal;
            }
            parentMeta.proxyItems = proxyItems;
            return selfVal;
        };
        return mayCreateProxyVal(selfVal, key);
    }
    function getUnProxyValue(value) {
        if (!isObject(value)) {
            return value;
        }
        var valueMeta = getDraftMeta$1(value);
        if (!valueMeta)
            return value;
        return valueMeta.copy;
    }
    /**
     * 拦截 set delete clear add
     * 支持用户使用 callback 的第三位参数 (val, key, mapOrSet) 的 mapOrSet 当做 draft 使用
     */
    function replaceSetOrMapMethods(mapOrSet, meta, options) {
        var dataType = options.dataType;
        // 拦截 set delete clear add，注意 set，add 在末尾判断后添加
        // 支持用户使用 callback 的第三位参数 (val, key, map) 的 map 当做 draft 使用
        var oriDel = mapOrSet.delete.bind(mapOrSet);
        var oriClear = mapOrSet.clear.bind(mapOrSet);
        mapOrSet.delete = function limuDelete() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            markModified(meta);
            return oriDel.apply(void 0, args);
        };
        mapOrSet.clear = function limuClear() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            markModified(meta);
            return oriClear.apply(void 0, args);
        };
        if (dataType === SET) {
            var oriAdd_1 = mapOrSet.add.bind(mapOrSet);
            mapOrSet.add = function limuAdd() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                markModified(meta);
                // recordPatch({ meta, ...options });
                return oriAdd_1.apply(void 0, args);
            };
        }
        if (dataType === MAP) {
            var oriSet_1 = mapOrSet.set.bind(mapOrSet);
            mapOrSet.set = function limuSet() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                markModified(meta);
                // recordPatch({ meta, ...options });
                // @ts-ignore
                return oriSet_1.apply(void 0, args);
            };
        }
    }

    function mayMarkModified(options) {
        var calledBy = options.calledBy, parentMeta = options.parentMeta, op = options.op, parentType = options.parentType;
        // 对于由 set 陷阱触发的 handleDataNode 调用，需要替换掉爷爷数据节点 key 指向的 value
        if (['deleteProperty', 'set'].includes(calledBy)
            ||
                (calledBy === 'get' && ((parentType === SET && SHOULD_REASSIGN_SET_METHODS.includes(op)) // 针对 Set.add
                    || (parentType === ARRAY && SHOULD_REASSIGN_ARR_METHODS.includes(op)) // 针对 Array 一系列的改变操作
                    || (parentType === MAP && SHOULD_REASSIGN_MAP_METHODS.includes(op)) // 针对 Map 一系列的改变操作
                ))) {
            markModified(parentMeta);
        }
    }
    function handleDataNode(parentDataNode, copyCtx) {
        var op = copyCtx.op, key = copyCtx.key, mayProxyValue = copyCtx.value, calledBy = copyCtx.calledBy, parentType = copyCtx.parentType, parentMeta = copyCtx.parentMeta;
        if (op === 'toJSON' && !mayProxyValue) {
            // 兼容 JSON.stringify 调用 
            return;
        }
        /**
         * 防止 value 本身就是一个 Proxy
         * var draft_a1_b = draft.a1.b;
         * draft.a2 = draft_a1_b;
         */
        var value = getUnProxyValue(mayProxyValue);
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
        var self = parentMeta.self, parentCopy = parentMeta.copy;
        mayMarkModified({ calledBy: calledBy, parentMeta: parentMeta, op: op, key: key, parentType: parentType });
        // 是 Map, Set, Array 类型的方法操作或者值获取
        var fnKeys = carefulFnKeys[parentType] || [];
        // 是函数调用
        if (fnKeys.includes(op) && isFn(mayProxyValue)) {
            // slice 操作无需使用 copy，返回自身即可
            if ('slice' === op) {
                return self.slice;
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
        var oldValue = parentCopy[key];
        var tryMarkOldValueMetaDel = function () {
            if (oldValue) {
                var oldValueMeta = getDraftMeta$1(oldValue);
                oldValueMeta && (oldValueMeta.isDel = true);
            }
        };
        if (calledBy === 'deleteProperty') {
            var valueMeta = getDraftMeta$1(mayProxyValue);
            // for test/complex/data-node-change case3
            if (valueMeta) {
                valueMeta.isDel = true;
            }
            else {
                // for test/complex/data-node-change (node-change 2)
                tryMarkOldValueMetaDel();
            }
            delete parentCopy[key];
            return;
        }
        parentCopy[key] = value;
        // 谨防是 a.b = { ... } ---> a.b = 1 的变异赋值方式
        tryMarkOldValueMetaDel();
    }

    function deepFreeze$1(obj) {
        if (isPrimitive(obj)) {
            return obj;
        }
        // @ts-ignore
        if (Array.isArray(obj) && obj.length > 0) {
            obj.forEach(function (item) {
                deepFreeze$1(item);
            });
            return Object.freeze(obj);
        }
        if (isSet(obj)) {
            var set_1 = obj;
            // TODD: throw error 'do not mutate' ?
            set_1.add = function () { return set_1; };
            set_1.delete = function () { return false; };
            set_1.clear = noop;
            return Object.freeze(obj);
        }
        if (isMap(obj)) {
            var map_1 = obj;
            // TODD: throw error 'do not mutate' ?
            map_1.set = function () { return map_1; };
            map_1.delete = function () { return false; };
            map_1.clear = noop;
            return Object.freeze(obj);
        }
        // get all properties
        var propertyNames = Object.getOwnPropertyNames(obj);
        // 遍历
        propertyNames.forEach(function (name) {
            var value = obj[name];
            if (value instanceof Object && value !== null) {
                deepFreeze$1(value);
            }
        });
        return Object.freeze(obj);
    }

    // size 直接返回，
    // 避免 Cannot set property size of #<Map> which has only a getter
    // 避免 Cannot set property size of #<Set> which has only a getter
    var PROPERTIES_BLACK_LIST = ['length', 'constructor', 'asymmetricMatch', 'nodeType', 'size'];
    var TYPE_BLACK_LIST = [ARRAY, SET, MAP];
    function buildLimuApis() {
        var limuApis = (function () {
            var metaVer = genMetaVer();
            var called = false;
            // let revoke: null | (() => void) = null;
            // 调用那一刻起，确定 autoFreeze 值
            var autoFreeze = limuConfig.autoFreeze;
            /**
             * 为了和下面这个 immer case 保持行为一致
             * https://github.com/immerjs/immer/issues/960
             * 如果数据节点上人工赋值了其他 draft 的话，当前 draft 结束后不能够被冻结（ 见set逻辑 ）
             */
            var canFreezeDraft = true;
            // 暂未实现
            var usePatches = limuConfig.usePatches;
            var patches = [];
            var inversePatches = [];
            // >= 3.0+ ver, copy on read, mark modified on write
            var limuTraps = {
                // parent指向的是代理之前的对象
                get: function (parent, key) {
                    var currentChildVal = parent[key];
                    if (key === '__proto__' || key === META_KEY) {
                        return currentChildVal;
                    }
                    if (isSymbol(key)) {
                        // 防止直接对 draft 时报错：Method xx.yy called on incompatible receiver
                        // 例如 Array.from(draft)
                        if (isFn(currentChildVal)) {
                            return currentChildVal.bind(parent);
                        }
                        return currentChildVal;
                    }
                    var parentMeta = getDraftMeta$1(parent);
                    var parentType = parentMeta === null || parentMeta === void 0 ? void 0 : parentMeta.selfType;
                    // console.log(`Get parentType:${parentType} key:${key} `, 'Read KeyPath', getKeyPath(parent, key, metaVer));
                    // copyWithin、sort 、valueOf... will hit the keys of 'asymmetricMatch', 'nodeType',
                    // PROPERTIES_BLACK_LIST 里 'length', 'constructor', 'asymmetricMatch', 'nodeType'
                    // 是为了配合 data-node-processor 里的 ATTENTION_1
                    if (parentMeta && TYPE_BLACK_LIST.includes(parentType) && PROPERTIES_BLACK_LIST.includes(key)) {
                        return parentMeta.copy[key];
                    }
                    // 可能会指向代理对象
                    currentChildVal = getProxyVal(currentChildVal, { key: key, parentMeta: parentMeta, parentType: parentType, ver: metaVer, traps: limuTraps, parent: parent, patches: patches, inversePatches: inversePatches, usePatches: usePatches });
                    // 用下标取数组时，可直接返回
                    // 例如数组操作: arrDraft[0].xxx = 'new'， 此时 arrDraft[0] 需要操作的是代理对象
                    if (parentType === ARRAY && canBeNum(key)) {
                        return currentChildVal;
                    }
                    if (carefulDataTypes[parentType]) {
                        currentChildVal = handleDataNode(parent, {
                            op: key,
                            key: key,
                            value: currentChildVal,
                            metaVer: metaVer,
                            calledBy: 'get',
                            patches: patches,
                            inversePatches: inversePatches,
                            usePatches: usePatches,
                            parentType: parentType,
                            parentMeta: parentMeta,
                        });
                        return currentChildVal;
                    }
                    return currentChildVal;
                },
                // parent 指向的是代理之前的对象
                set: function (parent, key, value) {
                    // console.log('Set', parent, key, value, 'Set KeyPath', getKeyPath(parent, key, metaVer));
                    var targetValue = value;
                    if (isDraft$1(value)) {
                        // see case debug/complex/set-draft-node
                        if (isInSameScope(value, metaVer)) {
                            targetValue = getUnProxyValue(value);
                            if (targetValue === parent[key]) {
                                return true;
                            }
                        }
                        else {
                            // TODO: judge value must be root draft node
                            // assign another version V2 scope draft node value to current scope V1 draft node
                            canFreezeDraft = false;
                        }
                    }
                    if (key === META_KEY) {
                        parent[key] = targetValue;
                        return true;
                    }
                    // speed up array operation
                    var parentMeta = getDraftMeta$1(parent);
                    // recordPatch({ meta, patches, inversePatches, usePatches, op: key, value });
                    var isArray = parentMeta.selfType === ARRAY;
                    if (parentMeta && isArray) {
                        // @ts-ignore
                        if (parentMeta.copy && parentMeta.__callSet && isArray && canBeNum(key)) {
                            parentMeta.copy[key] = targetValue;
                            return true;
                        }
                        // @ts-ignore
                        parentMeta.__callSet = true;
                    }
                    handleDataNode(parent, { parentMeta: parentMeta, key: key, value: targetValue, metaVer: metaVer, calledBy: 'set' });
                    return true;
                },
                deleteProperty: function (parent, key) {
                    // console.log('Delete ', parent, key);
                    var parentMeta = getDraftMeta$1(parent);
                    handleDataNode(parent, { parentMeta: parentMeta, op: 'del', key: key, value: '', metaVer: metaVer, calledBy: 'deleteProperty' });
                    return true;
                },
                // trap function call
                apply: function (target, thisArg, args) {
                    return target.apply(thisArg, args);
                },
            };
            return {
                createDraft: function (mayDraft, options) {
                    var _a, _b;
                    // allow user overwrite autoFreeze setting in current call process
                    var opts = options || {};
                    autoFreeze = (_a = opts.autoFreeze) !== null && _a !== void 0 ? _a : autoFreeze;
                    usePatches = (_b = opts.usePatches) !== null && _b !== void 0 ? _b : usePatches;
                    if (called) {
                        throw new Error('can not call new Limu().createDraft twice');
                    }
                    var baseOri = mayDraft;
                    called = true;
                    if (isDraft$1(mayDraft)) {
                        var draftMeta = getDraftMeta$1(mayDraft);
                        baseOri = draftMeta.self;
                    }
                    var meta = createScopedMeta(baseOri, { key: '', ver: metaVer, traps: limuTraps, finishDraft: limuApis.finishDraft });
                    recordVerScope(meta);
                    return meta.proxyVal;
                },
                finishDraft: function (proxyDraft) {
                    // attention: if pass a revoked proxyDraft
                    // it will throw: Cannot perform 'set' on a proxy that has been revoked
                    var rootMeta = getDraftMeta$1(proxyDraft);
                    if (!rootMeta) {
                        throw new Error('oops, rootMeta should not be null!');
                    }
                    if (rootMeta.level !== 0) {
                        throw new Error('oops, can not finish sub draft node!');
                    }
                    // 再次检查，以免用户是用 new Limu() 返回的 finishDraft
                    // 去结束另一个 new Limu() createDraft 的 草稿对象
                    if (metaVer !== rootMeta.ver) {
                        throw new Error('oops, the input draft does not match finishDraft handler');
                    }
                    var final = extraFinalData(rootMeta);
                    if (autoFreeze && canFreezeDraft) {
                        // TODO deep pruning
                        // see https://github.com/immerjs/immer/issues/687
                        // let cachedFrozenOriginalBase = frozenOriginalBaseMap.get(rootMeta.originalSelf);
                        final = deepFreeze$1(final);
                    }
                    // if (usePatches) {
                    //   return [final, patches, inversePatches];
                    // }
                    return final;
                },
            };
        })();
        return limuApis;
    }

    function original$1(mayDraftNode, trustLimu) {
        if (!isDraft$1(mayDraftNode)) {
            return mayDraftNode;
        }
        var meta = getDraftMeta$1(mayDraftNode);
        var self = (meta === null || meta === void 0 ? void 0 : meta.self) || null;
        // 上面已经 return 出去，正常情况一定能获取到 meta.self 的
        var existedSelf = self;
        if (trustLimu) {
            return existedSelf;
        }
        return existedSelf || null;
    }
    function current$1(mayDraftNode) {
        // TODO: 考虑添加 trustLimu 参数，和 original 保持一致？
        if (!isDraft$1(mayDraftNode)) {
            return mayDraftNode;
        }
        var meta = getDraftMeta$1(mayDraftNode);
        return deepCopy$1(meta.copy || meta.self);
    }

    /**
     * 因 3.0 做了大的架构改进，让其行为和 immer 保持了 100% 一致
     * 和 2.0 版本处于不兼容状态
     * 此处标记版本号辅助打包程序识别出是 2.0 版本的代码，让其不会被打包到 3.0 + 的 npm 包体中
     */
    var LIMU_MAJOR_VER = 3;

    // export interface IProduceWithPatches {
    //   <T extends ObjectLike>(baseState: T, cb: ProduceCb<T>, options?: ICreateDraftOptions): any[];
    // }
    var Limu = /** @class */ (function () {
        function Limu() {
            var limuApis = buildLimuApis();
            this.createDraft = limuApis.createDraft;
            // @ts-ignore
            this.finishDraft = limuApis.finishDraft;
        }
        return Limu;
    }());
    function createDraft(base, options) {
        var apis = new Limu();
        // @ts-ignore , add [as] just for click to see implement
        return apis.createDraft(base, options);
    }
    function finishDraft(draft) {
        var draftMeta = getDraftMeta$1(draft);
        var finishHandler = null;
        if (draftMeta) {
            // @ts-ignore , add [as] just for click to see implement
            finishHandler = draftMeta.finishDraft;
        }
        if (!finishHandler) {
            throw new Error("oops, not a Limu draft!");
        }
        return finishHandler(draft);
    }
    function checkCbFn(cb) {
        if (typeof cb !== 'function') {
            throw new Error('produce callback is not a function');
        }
    }
    // see issue https://github.com/tnfe/limu/issues/5
    function checkCbPromise(cb, result) {
        if (isPromiseFn(cb) || isPromiseResult(result)) {
            throw new Error('produce callback can not be a promise function');
        }
    }
    function innerProduce(baseState, cb, options) {
        checkCbFn(cb);
        var draft = createDraft(baseState, options);
        var result = cb(draft);
        checkCbPromise(cb, result);
        return finishDraft(draft);
    }
    function produceFn(baseState, cb, options) {
        if (!cb || typeof cb !== 'function') {
            // expect baseState to be a callback, support curried invocation
            // expect cb to be options
            var mayCb_1 = baseState;
            var mayOptions_1 = cb;
            checkCbFn(baseState);
            return function (state) {
                return innerProduce(state, mayCb_1, mayOptions_1);
            };
        }
        return innerProduce(baseState, cb, options);
    }
    // function producePatchesFn(baseState: any, cb: any, options?: ICreateDraftOptions) {
    //   const copyOpts: ICreateDraftOptions = { ... (options || {}), usePatches: true };
    //   return produceFn(baseState, cb, copyOpts);
    // };
    var getDraftMeta = getDraftMeta$1;
    var isDraft = isDraft$1;
    var produce = produceFn;
    // to be implemented in the future
    // export const produceWithPatches = producePatchesFn as unknown as IProduceWithPatches;
    var deepFreeze = deepFreeze$1;
    var deepCopy = function (obj) {
        return deepCopy$1(obj);
    };
    function setAutoFreeze(autoFreeze) {
        limuConfig.autoFreeze = autoFreeze;
    }
    function getAutoFreeze() {
        return limuConfig.autoFreeze;
    }
    function getMajorVer() {
        return LIMU_MAJOR_VER;
    }
    var original = original$1;
    var current = current$1;

    exports.Limu = Limu;
    exports.createDraft = createDraft;
    exports.current = current;
    exports.deepCopy = deepCopy;
    exports.deepFreeze = deepFreeze;
    exports["default"] = produce;
    exports.finishDraft = finishDraft;
    exports.getAutoFreeze = getAutoFreeze;
    exports.getDraftMeta = getDraftMeta;
    exports.getMajorVer = getMajorVer;
    exports.isDraft = isDraft;
    exports.original = original;
    exports.produce = produce;
    exports.setAutoFreeze = setAutoFreeze;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
