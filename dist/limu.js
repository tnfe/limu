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
        // attention???null desc is '[object Null]'
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
    // ???????????? proxyDraft ??? finishDraft ?????? ??????????????????
    var verKey = Symbol('V');
    var META_KEY = Symbol('M');
    var finishHandler = Symbol('limu-finishHandler');

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

    function attachMeta(dataNode, meta) {
        dataNode[META_KEY] = meta;
        return dataNode;
    }
    /**
     * ????????? proxy ???????????????????????????
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

    function shouldGenerateProxyItems(parentType, key) {
        // !!! ?????? Array??????????????? proxyItems
        if (parentType === 'Array')
            return true;
        var fnKeys = proxyItemFnKeys[parentType] || [];
        return fnKeys.includes(key);
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
    function getUnProxyValue(value) {
        if (!isObject(value)) {
            return value;
        }
        var valueMeta = getDraftMeta$1(value);
        if (!valueMeta)
            return value;
        return valueMeta.copy;
    }
    function getDataNodeType(dataNode) {
        var strDesc = getValStrDesc(dataNode);
        var dataType = desc2dataType[strDesc];
        return dataType;
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
        // ??????
        propertyNames.forEach(function (name) {
            var value = obj[name];
            if (value instanceof Object && value !== null) {
                deepFreeze$1(value);
            }
        });
        return Object.freeze(obj);
    }
    function markModified(mapSetMeta) {
        mapSetMeta.rootMeta.modified = true;
        var doMark = function (meta) {
            if (meta) {
                meta.modified = true;
                doMark(meta.parentMeta);
            }
        };
        doMark(mapSetMeta);
    }
    /**
     * ?????? set delete clear add
     * ?????????????????? callback ?????????????????? (val, key, mapOrSet) ??? mapOrSet ?????? draft ??????
     */
    function replaceSetOrMapMethods(mapOrSet, meta, options) {
        var dataType = options.dataType;
        // ?????? set delete clear add????????? set???add ????????????????????????
        // ?????????????????? callback ?????????????????? (val, key, map) ??? map ?????? draft ??????
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
        if (dataType === 'Set') {
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
        if (dataType === 'Map') {
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
        var calledBy = options.calledBy, parentDataNodeMeta = options.parentDataNodeMeta, op = options.op, parentType = options.parentType;
        // ????????? set ??????????????? handleDataNode ?????????????????????????????????????????? key ????????? value
        if (['deleteProperty', 'set'].includes(calledBy)
            ||
                (calledBy === 'get' && ((parentType === 'Set' && SHOULD_REASSIGN_SET_METHODS.includes(op)) // ?????? Set.add
                    || (parentType === 'Array' && SHOULD_REASSIGN_ARR_METHODS.includes(op)) // ?????? Array ????????????????????????
                    || (parentType === 'Map' && SHOULD_REASSIGN_MAP_METHODS.includes(op)) // ?????? Map ????????????????????????
                ))) {
            markModified(parentDataNodeMeta);
        }
    }
    function handleDataNode(parentDataNode, copyCtx) {
        var op = copyCtx.op, key = copyCtx.key, mayProxyValue = copyCtx.value, calledBy = copyCtx.calledBy, parentType = copyCtx.parentType;
        var parentDataNodeMeta = getDraftMeta$1(parentDataNode);
        /**
         * ?????? value ?????????????????? Proxy
         * var draft_a1_b = draft.a1.b;
         * draft.a2 = draft_a1_b;
         */
        var value = getUnProxyValue(mayProxyValue);
        /**
         * ????????????????????????????????????
         * // draft = { a: { b: { c: 1 } }};
         * const newData = { n1: { n2: 2 } };
         * draft.a = newData;
         * draft.a.n1.n2 = 888; // ?????? n2_DataNode ??????????????????
         */
        if (!parentDataNodeMeta) {
            parentDataNode[key] = value;
            return;
        }
        var self = parentDataNodeMeta.self, parentCopy = parentDataNodeMeta.copy;
        mayMarkModified({ calledBy: calledBy, parentDataNodeMeta: parentDataNodeMeta, op: op, key: key, parentType: parentType });
        // ??? Map, Set, Array ????????????????????????????????????
        var fnKeys = carefulFnKeys[parentType] || [];
        // ???????????????
        if (fnKeys.includes(op) && isFn(mayProxyValue)) {
            // slice ?????????????????? copy?????????????????????
            if ('slice' === op) {
                // @ts-ignore
                return self.slice;
            }
            else if (parentCopy) {
                // ?????? Map ??? Set ???????????????????????????????????????????????? set ??????????????????
                // ???????????? bind(parentDataNodeMeta.proxyVal)??? ??????????????????????????????
                // Method Map.prototype.forEach called on incompatible receiver
                // Method Set.prototype.forEach called on incompatible receiver
                // see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Called_on_incompatible_type
                if (parentType === carefulDataTypes.Set || parentType === carefulDataTypes.Map) {
                    // ?????? forEach ??????????????????????????? proxyItems????????? bind ?????????????????? proxyItems
                    return parentCopy[op].bind(parentCopy);
                }
                return parentCopy[op];
            }
            else {
                return self[op].bind(self);
            }
        }
        if (!parentCopy) {
            return value;
        }
        if (op === 'toJSON' && !mayProxyValue) {
            // ?????? JSON.stringify ?????? 
            return;
        }
        if (calledBy === 'deleteProperty') {
            var valueMeta = getDraftMeta$1(mayProxyValue);
            // for test/complex/data-node-change case3
            if (valueMeta) {
                valueMeta.isDel = true;
            }
            else {
                // for test/complex/data-node-change (node-change 2)
                var oldValue = parentDataNode[key];
                if (oldValue) {
                    var oldValueMeta = getDraftMeta$1(parentDataNode[key]);
                    oldValueMeta && (oldValueMeta.isDel = true);
                }
            }
            delete parentCopy[key];
        }
        else {
            parentCopy[key] = value;
        }
    }

    function deepCopy$1(obj, metaVer) {
        var innerDeep = function (obj) {
            if (isPrimitive(obj)) {
                return obj;
            }
            if (metaVer) {
                var meta = getDraftMeta$1(obj);
                var copy = meta === null || meta === void 0 ? void 0 : meta.copy;
                // ??????????????????????????????????????????????????????????????????????????????
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
     * ????????????copy
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
    // ?????????????????? meta ????????? 
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
            var modified = meta.modified, copy = meta.copy, parentMeta = meta.parentMeta, key = meta.key, self = meta.self, parentType = meta.parentType, revoke = meta.revoke, proxyVal = meta.proxyVal, isDel = meta.isDel;
            if (!copy)
                return revoke();
            delete copy[META_KEY];
            if (!parentMeta)
                return revoke();
            var targetNode = !modified ? self : copy;
            // ???????????? Map???Set ??????parent ???????????? ProxyItems??????????????? copy ????????????????????????
            var parentCopy = parentMeta.copy;
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
            // Array or Object
            // parentCopy[key] = targetNode;
            // return revoke();
        });
        rootMeta.scopes.length = 0;
    }
    function recordVerScope(meta) {
        meta.rootMeta.scopes.push(meta);
    }

    // size ???????????????
    // ?????? Cannot set property size of #<Map> which has only a getter
    // ?????? Cannot set property size of #<Set> which has only a getter
    var PROPERTIES_BLACK_LIST = ['length', 'constructor', 'asymmetricMatch', 'nodeType', 'size'];
    var TYPE_BLACK_LIST = [ARRAY, SET, MAP];
    function buildLimuApis() {
        var limuApis = (function () {
            var metaVer = genMetaVer();
            var called = false;
            // let revoke: null | (() => void) = null;
            // ??????????????????????????? autoFreeze ???
            var autoFreeze = limuConfig.autoFreeze;
            /**
             * ????????????????????? immer case ??????????????????
             * https://github.com/immerjs/immer/issues/960
             * ?????????????????????????????????????????? draft ??????????????? draft ?????????????????????????????? ???set?????? ???
             */
            var canFreezeDraft = true;
            // ????????????
            var usePatches = limuConfig.usePatches;
            var patches = [];
            var inversePatches = [];
            // >= 3.0+ ver, copy on read, mark modified on write
            var limuTraps = {
                // parent?????????????????????????????????
                get: function (parent, key) {
                    if (key === verKey) {
                        return metaVer;
                    }
                    var currentChildVal = parent[key];
                    if (key === '__proto__' || key === finishHandler || key === META_KEY) {
                        return currentChildVal;
                    }
                    if (isSymbol(key)) {
                        // ??????????????? draft ????????????Method xx.yy called on incompatible receiver
                        // ?????? Array.from(draft)
                        if (isFn(currentChildVal)) {
                            return currentChildVal.bind(parent);
                        }
                        return currentChildVal;
                    }
                    var parentMeta = getDraftMeta$1(parent);
                    var parentType = parentMeta === null || parentMeta === void 0 ? void 0 : parentMeta.selfType;
                    // console.log(`Get parentType:${parentType} key:${key} `, 'Read KeyPath', getKeyPath(parent, key, metaVer));
                    // copyWithin???sort ???valueOf... will hit the keys of 'asymmetricMatch', 'nodeType',
                    // PROPERTIES_BLACK_LIST ??? 'length', 'constructor', 'asymmetricMatch', 'nodeType'
                    // ??????????????? data-node-processor ?????? ATTENTION_1
                    if (parentMeta && TYPE_BLACK_LIST.includes(parentType) && PROPERTIES_BLACK_LIST.includes(key)) {
                        return parentMeta.copy[key];
                    }
                    var createProxyVal = function (selfVal, options) {
                        if (isPrimitive(selfVal)) {
                            return selfVal;
                        }
                        if (selfVal) {
                            var _a = (options || {}).key, key_1 = _a === void 0 ? '' : _a;
                            var valMeta = getDraftMeta$1(selfVal);
                            if (!isFn(selfVal)) {
                                // ???????????????????????????????????????
                                if (!valMeta) {
                                    var keyPath = getKeyPath(parent, key_1);
                                    var parentMeta_1 = getDraftMeta$1(parent);
                                    valMeta = {
                                        // @ts-ignore
                                        rootMeta: null,
                                        parentMeta: parentMeta_1,
                                        parents: [],
                                        parent: parentMeta_1.copy,
                                        parentType: parentType,
                                        selfType: getDataNodeType(selfVal),
                                        self: selfVal,
                                        key: key_1,
                                        keyPath: keyPath,
                                        level: getNextMetaLevel(parent),
                                        proxyVal: {},
                                        copy: {},
                                        modified: false,
                                        proxyItems: null,
                                        finishDraft: noop,
                                        ver: metaVer,
                                        revoke: noop,
                                    };
                                    var copy = makeCopyWithMeta(selfVal, valMeta);
                                    valMeta.copy = copy;
                                    var ret = Proxy.revocable(copy, limuTraps);
                                    valMeta.proxyVal = ret.proxy;
                                    valMeta.revoke = ret.revoke;
                                    valMeta.rootMeta = parentMeta_1.rootMeta;
                                    recordVerScope(valMeta);
                                    // child value ?????? copy
                                    parent[key_1] = copy;
                                }
                                return valMeta.proxyVal;
                            }
                            else {
                                if (shouldGenerateProxyItems(parentType, key_1)) {
                                    valMeta = getDraftMeta$1(parent);
                                    if (!valMeta) {
                                        throw new Error('[[ createMeta ]]: oops, meta should not be null');
                                    }
                                    if (!valMeta.proxyItems) {
                                        // ?????????????????????????????? item ????????????
                                        var proxyItems = [];
                                        if (parentType === SET) {
                                            var tmp_1 = new Set();
                                            parent.forEach(function (val) { return tmp_1.add(createProxyVal(val)); });
                                            replaceSetOrMapMethods(tmp_1, valMeta, { dataType: SET, patches: patches, inversePatches: inversePatches, usePatches: usePatches });
                                            proxyItems = attachMeta(tmp_1, valMeta);
                                            // ????????? 2.0.2 ????????????????????????copy?????????
                                            parentMeta.copy = proxyItems;
                                        }
                                        else if (parentType === MAP) {
                                            var tmp_2 = new Map();
                                            parent.forEach(function (val, key) { return tmp_2.set(key, createProxyVal(val, { key: key })); });
                                            replaceSetOrMapMethods(tmp_2, valMeta, { dataType: MAP, patches: patches, inversePatches: inversePatches, usePatches: usePatches });
                                            proxyItems = attachMeta(tmp_2, valMeta);
                                            // ????????? 2.0.2 ????????????????????????copy?????????
                                            parentMeta.copy = proxyItems;
                                        }
                                        else if (parentType === carefulDataTypes.Array) {
                                            valMeta.copy = valMeta.copy || parent.slice();
                                            proxyItems = valMeta.proxyVal;
                                        }
                                        valMeta.proxyItems = proxyItems;
                                    }
                                }
                                return selfVal;
                            }
                        }
                        return selfVal;
                    };
                    // ???????????????????????????
                    currentChildVal = createProxyVal(currentChildVal, { key: key });
                    var toReturn;
                    // ???????????????????????????????????????
                    // ??????????????????: arrDraft[0].xxx = 'new'??? ?????? arrDraft[0] ??????????????????????????????
                    if (parentType === carefulDataTypes.Array && canBeNum(key)) {
                        toReturn = currentChildVal;
                    }
                    else if (carefulDataTypes[parentType]) {
                        toReturn = handleDataNode(parent, {
                            op: key,
                            key: key,
                            value: currentChildVal,
                            metaVer: metaVer,
                            calledBy: 'get',
                            patches: patches,
                            inversePatches: inversePatches,
                            usePatches: usePatches,
                            parentType: parentType,
                        });
                    }
                    else {
                        toReturn = currentChildVal;
                    }
                    return toReturn;
                },
                // parent ?????????????????????????????????
                set: function (parent, key, value) {
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
                            // assign another version V2 scope draft node value to current scope V1 draft node
                            canFreezeDraft = false;
                        }
                    }
                    if (key === META_KEY) {
                        parent[key] = targetValue;
                        return true;
                    }
                    // console.log('Set', parent, key, value, 'Set KeyPath', getKeyPath(parent, key, metaVer));
                    // speed up array operation
                    var meta = getDraftMeta$1(parent);
                    if (meta) {
                        // recordPatch({ meta, patches, inversePatches, usePatches, op: key, value });
                        // @ts-ignore
                        if (meta.copy && meta.__callSet && meta.selfType === ARRAY && canBeNum(key)) {
                            meta.copy[key] = targetValue;
                            return true;
                        }
                        // @ts-ignore
                        meta.__callSet = true;
                    }
                    handleDataNode(parent, { key: key, value: targetValue, metaVer: metaVer, calledBy: 'set' });
                    return true;
                },
                deleteProperty: function (parent, key) {
                    // console.log('Delete ', parent, key);
                    handleDataNode(parent, { op: 'del', key: key, value: '', metaVer: metaVer, calledBy: 'deleteProperty' });
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
                    var baseStateType = getDataNodeType(baseOri);
                    var meta = {
                        // @ts-ignore add later
                        rootMeta: null,
                        parent: null,
                        parentMeta: null,
                        parents: [],
                        parentType: baseStateType,
                        selfType: baseStateType,
                        self: baseOri,
                        // @ts-ignore add later
                        copy: null,
                        modified: false,
                        key: '',
                        keyPath: [],
                        level: 0,
                        proxyVal: null,
                        proxyItems: null,
                        scopes: [],
                        finishDraft: limuApis.finishDraft,
                        ver: metaVer,
                    };
                    var baseCopy = makeCopyWithMeta(baseOri, meta);
                    meta.copy = baseCopy;
                    meta.rootMeta = meta;
                    var _c = Proxy.revocable(baseCopy, limuTraps), proxyDraft = _c.proxy, revokeHandler = _c.revoke;
                    meta.proxyVal = proxyDraft;
                    meta.revoke = revokeHandler;
                    recordVerScope(meta);
                    return proxyDraft;
                },
                finishDraft: function (proxyDraft) {
                    // attention: if pass a revoked proxyDraft
                    // it will throw: Cannot perform 'set' on a proxy that has been revoked
                    var rootMeta = getDraftMeta$1(proxyDraft);
                    if (!rootMeta) {
                        throw new Error('oops, rootMeta should not be null!');
                    }
                    // ????????????????????????????????? new Limu() ????????? finishDraft 
                    // ?????????????????? new Limu() createDraft ??? ????????????
                    if (metaVer !== rootMeta.ver) {
                        throw new Error('oops, the input draft does not match finishDraft handler');
                    }
                    var self = rootMeta.self, copy = rootMeta.copy, modified = rootMeta.modified;
                    var final = self;
                    // ??? copy ???????????????????????????????????????????????????
                    var isDraftChanged = copy && modified;
                    if (isDraftChanged) {
                        final = rootMeta.copy;
                    }
                    clearScopes(rootMeta);
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
        // ???????????? return ??????????????????????????????????????? meta.self ???
        var existedSelf = self;
        if (trustLimu) {
            return existedSelf;
        }
        return existedSelf || null;
    }
    function current$1(mayDraftNode) {
        // TODO: ???????????? trustLimu ???????????? original ???????????????
        if (!isDraft$1(mayDraftNode)) {
            return mayDraftNode;
        }
        var meta = getDraftMeta$1(mayDraftNode);
        return deepCopy$1(meta.copy || meta.self);
    }

    /**
     * ??? 3.0 ?????????????????????????????????????????? immer ????????? 100% ??????
     * ??? 2.0 ???????????????????????????
     * ??????????????????????????????????????????????????? 2.0 ?????????????????????????????????????????? 3.0 + ??? npm ?????????
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
