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

    var _a, _b, _c, _d;
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Tencent Corporation. All rights reserved.
     *  Licensed under the MIT License.
     *--------------------------------------------------------------------------------------------*/
    var carefulDataTypes = { Map: 'Map', Set: 'Set', Array: 'Array' };
    var objDesc = '[object Object]';
    var mapDesc = '[object Map]';
    var setDesc = '[object Set]';
    var arrDesc = '[object Array]';
    var fnDesc = '[object Function]';
    var desc2dataType = (_a = {},
        _a[mapDesc] = carefulDataTypes.Map,
        _a[setDesc] = carefulDataTypes.Set,
        _a[arrDesc] = carefulDataTypes.Array,
        _a[objDesc] = 'Object',
        _a);
    var arrFnKeys = [
        'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'flat', 'flatMap',
        'forEach', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf', 'map', 'pop', 'push', 'reduce', 'reduceRight',
        'reverse', 'shift', 'unshift', 'slice', 'some', 'sort', 'splice', 'values', 'valueOf',
    ];
    var arrFnKeysThatNeedMarkModified = [
        'copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'unshift', 'splice',
    ];
    var mapFnKeys = ['clear', 'delete', 'entries', 'forEach', 'get', 'has', 'keys', 'set', 'values'];
    var mapFnKeysThatNeedMarkModified = [
        'clear', 'delete', 'set',
    ];
    var setFnKeys = ['add', 'clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values'];
    var setFnKeysThatNeedMarkModified = [
        'add', 'clear', 'delete',
    ];
    var arrIgnoreFnOrAttributeKeys = [
        // 'forEach', 'map', 'sort', 'copyWithin', 'reverse',
        'length',
        'slice', 'concat', 'find', 'findIndex', 'filter', 'flat', 'flatMap', 'includes',
        'indexOf', 'every', 'some', 'constructor', 'join', 'keys', 'lastIndexOf', 'reduce',
        'reduceRight', 'values', 'entries',
        'valueOf',
    ];
    var mapIgnoreFnKeys = [
        // 'forEach', 'get',
        'entries', 'keys', 'values', 'has',
    ];
    var mapIgnoreFnOrAttributeKeys = __spreadArray(__spreadArray([], mapIgnoreFnKeys, true), [
        'size',
    ], false);
    var setIgnoreFnKeys = [
        // 'forEach',
        'entries', 'has', 'keys', 'values'
    ];
    // export const setIgnoreFnKeys = ['entries', 'has', 'keys', 'values'];
    var setIgnoreFnOrAttributeKeys = __spreadArray(__spreadArray([], setIgnoreFnKeys, true), [
        'size',
    ], false);
    var carefulType2fnKeys = (_b = {},
        _b[carefulDataTypes.Map] = mapFnKeys,
        _b[carefulDataTypes.Set] = setFnKeys,
        _b[carefulDataTypes.Array] = arrFnKeys,
        _b);
    var carefulType2fnKeysThatNeedMarkModified = (_c = {},
        _c[carefulDataTypes.Map] = mapFnKeysThatNeedMarkModified,
        _c[carefulDataTypes.Set] = setFnKeysThatNeedMarkModified,
        _c[carefulDataTypes.Array] = arrFnKeysThatNeedMarkModified,
        _c);
    var carefulType2proxyItemFnKeys = (_d = {},
        _d[carefulDataTypes.Map] = ['forEach', 'get'],
        _d[carefulDataTypes.Set] = ['forEach'],
        _d[carefulDataTypes.Array] = ['forEach', 'map'],
        _d);

    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Tencent Corporation. All rights reserved.
     *  Licensed under the MIT License.
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
    function canHaveProto(val) {
        return !isPrimitive(val);
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
     *--------------------------------------------------------------------------------------------*/
    // 用于验证 proxyDraft 和 finishDraft函数 是否能够匹配
    var verKey = Symbol('verKey');
    var metasKey = Symbol('metas');
    var finishHandler = Symbol('finishHandler');
    var isModifiedKey = Symbol('isModifiedKey');

    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Tencent Corporation. All rights reserved.
     *  Licensed under the MIT License.
     *--------------------------------------------------------------------------------------------*/
    var ver2MetasList = {};
    var verWrap = { value: 0 };

    function shouldGenerateProxyItems(parentType, key) {
        // !!! 对于 Array，直接生成 proxyItems
        if (parentType === 'Array')
            return true;
        var proxyItemFnKeys = carefulType2proxyItemFnKeys[parentType] || [];
        return proxyItemFnKeys.includes(key);
    }
    function getKeyPath(mayContainMetaObj, curKey, metaVer) {
        var pathArr = [curKey];
        var meta = getMeta(mayContainMetaObj, metaVer);
        if (meta && meta.level > 0) {
            var keyPath = meta.keyPath;
            return __spreadArray(__spreadArray([], keyPath, true), [curKey], false);
        }
        return pathArr;
    }
    function getMeta(mayMetasProtoObj, metaVer) {
        var metas = getMetas(mayMetasProtoObj);
        if (metas)
            return metas[metaVer];
        return null;
    }
    function getMetaForDraft(draft, metaVer) {
        if (!draft)
            return null;
        return getMeta(draft.__proto__, metaVer);
    }
    function getMetas(mayMetasProtoObj) {
        if (!mayMetasProtoObj)
            return null;
        return mayMetasProtoObj[metasKey];
    }
    // 调用处已保证 meta 不为空
    function makeCopy(meta, mayACopy) {
        var metaOwner = meta.self;
        if (Array.isArray(metaOwner)) {
            return meta.proxyItems || metaOwner.slice();
        }
        if (isObject(metaOwner)) {
            return __assign({}, metaOwner);
        }
        if (isMap(metaOwner)) {
            return (meta.proxyItems || mayACopy || new Map(metaOwner));
        }
        if (isSet(metaOwner)) {
            return (meta.proxyItems || mayACopy || new Set(metaOwner));
        }
        throw new Error("data ".concat(metaOwner, " try trigger getCopy, its type is ").concat(typeof meta));
    }
    /**
     * 尝试生成copy
     * @param val
     * @returns
     */
    function tryMakeCopy(val) {
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
        return val;
    }
    function getUnProxyValue(value, metaVer) {
        var valueMeta = getMetaForDraft(value, metaVer);
        if (!valueMeta)
            return value;
        var copy = valueMeta.copy;
        if (!copy) {
            copy = makeCopy(valueMeta);
            valueMeta.copy = copy;
        }
        return copy;
    }
    // 外部已确保是obj
    function setMeta(obj, meta, metaVer) {
        var metas = getMetas(obj);
        metas && (metas[metaVer] = meta);
    }
    function getMetaVer() {
        verWrap.value += 1;
        var metaVer = verWrap.value;
        ver2MetasList[metaVer] = [];
        return metaVer;
    }
    function getNextMetaLevel(mayContainMetaObj, metaVer) {
        var meta = getMeta(mayContainMetaObj, metaVer);
        return meta ? meta.level + 1 : 1;
    }
    function getRealProto(val) {
        var proto = Object.getPrototypeOf(val);
        // 防止 Object.create(null) 创建的对象没有原型链
        if (!proto)
            return Object.prototype;
        return Object.getPrototypeOf(val);
    }
    function setMetasProto(val, realProto) {
        // 把 metas 放到单独的 __proto__ 层里，确保写入的数据不会污染 Object.prototype
        //  __proto__:
        //    Symbol('metas'): { ... }
        //    __proto__: Object | Array
        var metaProto = Object.create(null);
        Object.setPrototypeOf(metaProto, realProto);
        // 故意多写一层 __proto__ 容器
        Object.setPrototypeOf(val, metaProto);
        val.__proto__[metasKey] = {};
    }
    /**
     * 是否是 proxy 代理的草稿对象
     * @param mayDraft
     * @returns
     */
    function isDraft$1(mayDraft) {
        var ver = mayDraft === null || mayDraft === void 0 ? void 0 : mayDraft[verKey];
        return !!ver;
    }
    function getDataNodeType(dataNode) {
        var strDesc = getValStrDesc(dataNode);
        var dataType = desc2dataType[strDesc];
        return dataType;
    }
    function reassignGrandpaAndParent(parentDataNodeMeta, calledBy, setKey) {
        var _a;
        var grandpaMeta = parentDataNodeMeta.parentMeta, parentType = parentDataNodeMeta.parentType, selfType = parentDataNodeMeta.selfType, parentDataNodeIdx = parentDataNodeMeta.idx, parentDataNodeCopy = parentDataNodeMeta.copy;
        // 数组操作比较特殊，有2种方式，包括了(1方法修改) 和 (2自身通过索引直接修改)，这里处理到第2种
        if (calledBy === 'set' && canBeNum(setKey) && selfType === 'Array') {
            var proxyItems_1 = parentDataNodeMeta.proxyItems;
            if (proxyItems_1) {
                // @ts-ignore
                proxyItems_1[isModifiedKey] = true;
            }
        }
        if (!grandpaMeta) {
            return;
        }
        var grandpaCopy = grandpaMeta.copy;
        // 回溯过程中，为没拷贝体的爷爷节点生成拷贝对象
        if (!grandpaCopy) {
            grandpaCopy = makeCopy(grandpaMeta);
            grandpaMeta.copy = grandpaCopy;
        }
        var needMarkModified = false;
        // console.log(' ************ [[ DEBUG ]] reassignGrandpaAndParent for ' + parentType, ' ,K:', parentDataNodeIdx, ' ,V:', parentDataNodeCopy);
        if (parentType === 'Map') {
            grandpaCopy.set(parentDataNodeIdx, parentDataNodeCopy);
            needMarkModified = true;
        }
        else if (parentType === 'Object') {
            grandpaCopy[parentDataNodeIdx] = parentDataNodeCopy;
        }
        else if (parentType === 'Array') {
            // 数组操作比较特殊，有2种方式，包括了1方法修改和2自身通过索引直接修改，这里处理到第1种
            grandpaCopy[parentDataNodeIdx] = parentDataNodeCopy;
            needMarkModified = true;
        }
        else if (parentType === 'Set') {
            // Set 无法做 reassign，这里仅标记 needMarkModified，在 finishDraft 步骤里会最 Set的重计算
            needMarkModified = true;
        }
        var proxyItems = grandpaMeta.proxyItems;
        if (needMarkModified && proxyItems) {
            // @ts-ignore
            // proxyItems.__modified = true;
            proxyItems[isModifiedKey] = true;
            // @ts-ignore
            // !!! 方便在 finishDraft 里，遇到 Set 结构还可以指回来
            proxyItems.__parent = (_a = grandpaMeta.parentMeta) === null || _a === void 0 ? void 0 : _a.copy;
            // @ts-ignore
            proxyItems.__dataIndex = grandpaMeta.idx;
        }
    }
    function markRootModifiedAndReassign(meta, parent, metaVer) {
        if (meta === null || meta === void 0 ? void 0 : meta.rootMeta) {
            meta.rootMeta.modified = true;
            var parentMeta = getMeta(parent, metaVer);
            if (parentMeta) {
                reassignGrandpaAndParent(parentMeta);
            }
        }
    }
    /**
     * 拦截 set delete clear add
     * 支持用户使用 callback 的第三位参数 (val, key, mapOrSet) 的 mapOrSet 当做 draft 使用
     */
    function replaceSetOrMapMethods(dataType, mapOrSet, meta, parent, metaVer) {
        // 拦截 set delete clear add，注意 set，add 在末尾判断后添加
        // 支持用户使用 callback 的第三位参数 (val, key, map) 的 map 当做 draft 使用
        var oriDel = mapOrSet.delete.bind(mapOrSet);
        var oriClear = mapOrSet.clear.bind(mapOrSet);
        mapOrSet.add = function limuAdd() {
            noop();
        };
        mapOrSet.set = function limuSet() {
            noop();
        };
        mapOrSet.delete = function limuDelete() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            markRootModifiedAndReassign(meta, parent, metaVer);
            return oriDel.apply(void 0, args);
        };
        mapOrSet.clear = function limuClear() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            markRootModifiedAndReassign(meta, parent, metaVer);
            return oriClear.apply(void 0, args);
        };
        if (dataType === 'Set') {
            var oriAdd_1 = mapOrSet.add.bind(mapOrSet);
            mapOrSet.add = function limuAdd() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                markRootModifiedAndReassign(meta, parent, metaVer);
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
                markRootModifiedAndReassign(meta, parent, metaVer);
                return oriSet_1.apply(void 0, args);
            };
        }
    }

    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Tencent Corporation. All rights reserved.
     *  Licensed under the MIT License.
     *--------------------------------------------------------------------------------------------*/
    // slice、concat 以及一些特殊的key取值等操作无需copy副本
    function allowCopyForOp(parentType, op) {
        if (parentType === carefulDataTypes.Array) {
            if (arrIgnoreFnOrAttributeKeys.includes(op))
                return false;
            if (canBeNum(op))
                return false;
        }
        if (parentType === carefulDataTypes.Map && mapIgnoreFnOrAttributeKeys.includes(op)) {
            return false;
        }
        if (parentType === carefulDataTypes.Set && setIgnoreFnOrAttributeKeys.includes(op)) {
            return false;
        }
        // like Symbol(Symbol.isConcatSpreadable) in test case array-base/concat
        if (isSymbol(op)) {
            return false;
        }
        return true;
    }
    var SHOULD_REASSIGN_ARR_METHODS = ['push', 'pop', 'shift', 'splice', 'unshift', 'reverse', 'copyWithin', 'delete', 'fill'];
    var SHOULD_REASSIGN_MAP_METHODS = ['clear', 'delete', 'set'];
    var SHOULD_REASSIGN_SET_METHODS = ['add', 'clear', 'delete'];
    function mayReassign(options) {
        var calledBy = options.calledBy, parentDataNodeMeta = options.parentDataNodeMeta, op = options.op, parentType = options.parentType, key = options.key;
        // 对于由 set 陷阱触发的 copyAndGetDataNode 调用，需要替换掉爷爷数据节点 key 指向的 value
        if (['deleteProperty', 'set'].includes(calledBy)
            ||
                (calledBy === 'get' && ((parentType === 'Set' && SHOULD_REASSIGN_SET_METHODS.includes(op)) // 针对 Set.add
                    || (parentType === 'Array' && SHOULD_REASSIGN_ARR_METHODS.includes(op)) // 针对 Array 一系列的改变操作
                    || (parentType === 'Map' && SHOULD_REASSIGN_MAP_METHODS.includes(op)) // 针对 Array 一系列的改变操作
                ))) {
            reassignGrandpaAndParent(parentDataNodeMeta, calledBy, key);
        }
    }
    function copyAndGetDataNode(parentDataNode, copyCtx, isFirstCall) {
        var op = copyCtx.op, key = copyCtx.key, mayProxyValue = copyCtx.value, metaVer = copyCtx.metaVer, calledBy = copyCtx.calledBy, parentType = copyCtx.parentType;
        // console.log('[[ DEBUG ]] copyAndGetDataNode:', copyCtx, 'isFirstCall:' + isFirstCall);
        // console.log('[[ DEBUG ]] copyAndGetDataNode:', 'isFirstCall:' + isFirstCall);
        var parentDataNodeMeta = getMeta(parentDataNode, metaVer);
        /**
         * 防止 value 本身就是一个 Proxy
         * var draft_a1_b = draft.a1.b;
         * draft.a2 = draft_a1_b;
         */
        var value = mayProxyValue;
        if (isFirstCall) {
            // value 本身可能是代理对象
            value = getUnProxyValue(mayProxyValue, metaVer);
        }
        /**
         * 链路断裂，此对象未被代理
         * // draft = { a: { b: { c: 1 } }};
         * const newData = { n1: { n2: 2 } };
         * draft.a = newData;
         * draft.a.n1.n2 = 888; // 此时 n2_DataNode 是未代理对象
         */
        if (!parentDataNodeMeta) {
            parentDataNode[key] = value;
            return;
        }
        var self = parentDataNodeMeta.self, rootMeta = parentDataNodeMeta.rootMeta;
        var parentCopy = parentDataNodeMeta.copy;
        var allowCopy = allowCopyForOp(parentType, op);
        // try {
        //   console.log(`allowCopy ${allowCopy} op ${op}`);
        // } catch (err) {
        //   console.log(`allowCopy ${allowCopy} op symbol`);
        // }
        if (allowCopy) {
            // 没有 copy 就通过 makeCopy 造一个 copy
            // 有了 copy 也要看parentType类型，如果是 'Map', 'Set' 的话，也需要 makeCopy
            // 因为此时 parentDataNodeMeta 携带的 proxyItems 才是正确的 copy 体
            // 否则在 test/complex/case1.ts 示例里，先调用了 mixArr.push，为 mixArr 每一个 item 项生成的copy
            // Map 的 copy 是 Proxy { Map: name=> {name:'bj'} }
            // 而我们需要的是 { Map: name=> Proxy {name:'bj'} }，否则导致测试失败
            if (!parentCopy || ['Map', 'Set'].includes(parentType)) {
                parentCopy = makeCopy(parentDataNodeMeta, parentCopy);
                parentDataNodeMeta.copy = parentCopy;
            }
            if (!isPrimitive(value)) {
                var valueMeta = getMeta(mayProxyValue, metaVer);
                if (valueMeta) {
                    /**
                     * 值的父亲节点和当时欲写值的数据节点层级对不上，说明节点发生了层级移动
                     * 总是记录最新的父节点关系，防止原有的关系被解除
                     * ------------------------------------------------------------
                     *
                     * // 移动情况
                     * // draft is { a: { b: { c: { d: { e: 1 } } } } }
                     * const dValue = draft.a.b.c.d; // { e: 1 }
                     * const cValue = draft.a.b.c; // cValue: { d: { e: 1 } }，此时 cValue 已被代理，parentLevel = 2
                     *
                     * // [1]: dataNode: draft, key: 'a', value: cValue
                     * draft.a = cValue;
                     * // parentLevel = 0, 数据节点层级出现移动
                     *
                     * // [2]: dataNode: draft.a, key: 'b', value: cValue
                     * draft.a.b = cValue;
                     * // parentLevel = 1, 数据节点层级出现移动
                     *
                     * // [3]: dataNode: draft.a.b, key: 'c', value: cValue
                     * draft.a.b.c = cValue;
                     * // parentLevel = 2, 数据节点层级没有出现移动，还保持原来的关系
                     *
                     * ------------------------------------------------------------
                     * // 关系解除情况
                     * // draft is { a: { b: { c: { d: { e: 1 } } } }, a1: 2 }
                     * const d = draft.a.b.c.d;
                     * draft.a1 = d;
                     * draft.a.b.c = null; // d属性数据节点和父亲关系解除
                     */
                    if (valueMeta.parentMeta && valueMeta.parentMeta.level !== parentDataNodeMeta.level) {
                        // 修正 valueMeta 维护的相关数据
                        valueMeta.parent = parentDataNodeMeta.self;
                        valueMeta.level = parentDataNodeMeta.level + 1;
                        valueMeta.key = key;
                        valueMeta.keyPath = getKeyPath(valueMeta.parent, key, metaVer);
                        /**
                         * 父亲节点 P 和当时欲写值的数据节点 C 层级相等，也不能保证 C 向上链路的所有父辈们是否有过层级移动
                         * 因为他们发生移动时，是不会去修改所有子孙的元数据的
                         */
                    }
                    /**
                     * 还没为当前数据节点建立代理，就被替换了
                     * // draft is { a: { b: { c: 1 } } }
                     * draft.a = { b: { c: 100 } };
                     */
                }
            }
            // console.log('[[ DEBUG ]] mayReassign ', `calledBy:${calledBy}  parentType:${parentType} op:${op}`);
            mayReassign({ calledBy: calledBy, parentDataNodeMeta: parentDataNodeMeta, op: op, key: key, parentType: parentType });
            // 向上回溯，复制完整条链路，parentMeta 为 null 表示已回溯到顶层
            var grandpaMeta = parentDataNodeMeta.parentMeta;
            if (grandpaMeta) {
                var copyCtx_1 = {
                    key: parentDataNodeMeta.key, parentType: parentDataNodeMeta.parentType,
                    value: parentCopy,
                    metaVer: metaVer,
                    calledBy: calledBy,
                };
                // console.log('向上回溯，复制完整条链路', copyCtx);
                copyAndGetDataNode(grandpaMeta.self, copyCtx_1, false);
            }
        }
        // 是 Map, Set, Array 类型的方法操作或者值获取
        var fnKeys = carefulType2fnKeys[parentType] || [];
        var markModified = function () {
            // const proxyValue = getUnProxyValue(mayProxyValue, metaVer);
            // const valueMeta = getMeta(proxyValue, metaVer);
            // console.log('****** value ', proxyValue);
            // console.log('****** isDraft ', isDraft(mayProxyValue));
            // 标记当前节点已更新
            parentDataNodeMeta.modified = true;
            rootMeta && (rootMeta.modified = true);
            // console.log('标记更新', parentDataNodeMeta);
        };
        // console.log(`parentType:${parentType}  op:${op}  key:${key}`);
        // console.log('fnKeys.includes(op) ', fnKeys.includes(op));
        // console.log('isFn(mayProxyValue) ', isFn(mayProxyValue));
        // 是函数调用
        if (fnKeys.includes(op) && isFn(mayProxyValue)) {
            // console.log('mayProxyValue isFn true');
            var fnKeysThatNeedMarkModified = carefulType2fnKeysThatNeedMarkModified[parentType];
            if (fnKeysThatNeedMarkModified.includes(op)) {
                markModified();
            }
            // slice 操作无需使用 copy，返回自身即可
            if ('slice' === op) {
                // @ts-ignore
                return self.slice;
            }
            else if (parentCopy) {
                // 因为 Map 和 Set 里的对象不能直接操作修改，是通过 set 调用来修改的
                // 所以无需 bind(parentDataNodeMeta.proxyVal)， 否则会以下情况出现，
                // Method Map.prototype.forEach called on incompatible receiver
                // Method Set.prototype.forEach called on incompatible receiver
                // see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Called_on_incompatible_type
                if (parentType === carefulDataTypes.Set || parentType === carefulDataTypes.Map) {
                    // 注意 forEach 等方法已提前生成了 proxyItems，这里 bind 的目标优先取 proxyItems
                    return parentCopy[op].bind(parentCopy);
                }
                if (['map', 'sort'].includes(op)) {
                    return parentCopy[op].bind(parentDataNodeMeta.proxyVal);
                }
                /**
                 * ATTENTION_1
                 * 确保回调里的参数能拿到代理对象，如
                 * ```js
                 * // 此处的 arr 需要转为代理对象，因为用户可能直接操作它修改数据
                 * arr.forEach((value, index, arr)=>{...})
                 * ```
                 */
                // console.log(`parentCopy ${parentCopy} op ${op}`);
                return parentCopy[op].bind(parentDataNodeMeta.proxyItems);
            }
            else {
                // console.log(`self ${self} op ${op}`);
                return self[op].bind(self);
            }
        }
        if (!parentCopy) {
            return value;
        }
        // 处于递归调用则需要忽略以下逻辑（递归是会传递 isFirstCall 为 false ）
        if (isFirstCall) {
            if (op === 'del') {
                delete parentCopy[key];
            }
            else if (op === 'toJSON' && !mayProxyValue) {
                // 兼容 JSON.stringify 调用 
                return;
            }
            else {
                // console.log('before modify ', parentCopy, key, value);
                parentCopy[key] = value;
                // console.log('after modify ', parentCopy, key, value);
                // mayReassign(calledBy, parentDataNodeMeta);
            }
        }
        if (['set', 'deleteProperty'].includes(calledBy)) {
            markModified();
        }
    }
    function clearAllDataNodeMeta(metaVer) {
        var metasList = ver2MetasList[metaVer];
        metasList.forEach(function (metas) { return delete metas[metaVer]; });
    }
    function ensureDataNodeMetasProtoLayer(val, metaVer, throwError) {
        if (throwError === void 0) { throwError = false; }
        var canValHaveProto = canHaveProto(val);
        if (canValHaveProto) {
            var metas = val[metasKey];
            if (!metas) {
                setMetasProto(val, getRealProto(val));
                metas = val[metasKey];
            }
            ver2MetasList[metaVer].push(metas);
            return;
        }
        if (throwError)
            throw new Error('base state type can only be object(except null) or array');
    }
    /**
     * 节省一些判定，提高性能之用
     */
    function ensureDataNodeMetasProtoLayerFast(val, metaVer) {
        var metas = val[metasKey];
        if (!metas) {
            setMetasProto(val, getRealProto(val));
            metas = val[metasKey];
        }
        ver2MetasList[metaVer].push(metas);
    }

    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Tencent Corporation. All rights reserved.
     *  Licensed under the MIT License.
     *--------------------------------------------------------------------------------------------*/
    // size 直接返回，
    // 避免 Cannot set property size of #<Map> which has only a getter
    // 避免 Cannot set property size of #<Set> which has only a getter
    var PROPERTIES_BLACK_LIST = ['length', 'constructor', 'asymmetricMatch', 'nodeType', 'size'];
    var TYPE_BLACK_LIST = [carefulDataTypes.Array, carefulDataTypes.Set, carefulDataTypes.Map];
    // 这些类型不关心 copy
    var NO_CARE_COPY_TYPE_LIST = [carefulDataTypes.Set, carefulDataTypes.Map];
    var inner = {
        handleMap: function (rootMeta, metaVer, final) {
            // @ts-ignore
            var mapProxyItemsList = rootMeta.proxyItemsMgr['Map'];
            var mayRootMap = null;
            // 用于辅助跑通  /test/map-other/object-map.ts
            mapProxyItemsList.forEach(function (proxyItems) {
                // @ts-ignore, 在 reassignGrandpaAndParent 做了标记
                if (proxyItems[isModifiedKey]) {
                    var tmpMap_1 = new Map();
                    mayRootMap = tmpMap_1;
                    proxyItems.forEach(function (val, key) {
                        var meta = getMeta(val, metaVer);
                        if (meta) {
                            var toSetItem = !meta.modified ? meta.self : meta.copy;
                            tmpMap_1.set(key, toSetItem);
                        }
                    });
                    // @ts-ignore，指回来
                    if (proxyItems.__parent) {
                        // @ts-ignore
                        proxyItems.__parent[proxyItems.__dataIndex] = tmpMap_1;
                    }
                }
            });
            // 根对象就是 Map 时，直接将 final 指向可能做好的新 Map
            if (rootMeta.parentType === 'Map') {
                return mayRootMap || final;
            }
            return final;
        },
        handleSet: function (rootMeta, metaVer, final) {
            // @ts-ignore
            var setProxyItemsList = rootMeta.proxyItemsMgr['Set'];
            var mayRootSetArr = null;
            setProxyItemsList.forEach(function (proxyItems) {
                // @ts-ignore, 在 reassignGrandpaAndParent 做了标记
                if (proxyItems[isModifiedKey]) {
                    var arr_1 = Array.from(proxyItems);
                    mayRootSetArr = arr_1;
                    arr_1.forEach(function (val, idx) {
                        var meta = getMeta(val, metaVer);
                        if (meta) {
                            arr_1[idx] = !meta.modified ? meta.self : meta.copy;
                        }
                    });
                    // @ts-ignore，指回来
                    if (proxyItems.__parent) {
                        // @ts-ignore
                        proxyItems.__parent[proxyItems.__dataIndex] = new Set(arr_1);
                    }
                }
            });
            // 根对象就是 Set 时，直接将 final 指向可能做好的新 Set
            if (rootMeta.parentType === 'Set') {
                return mayRootSetArr ? new Set(mayRootSetArr) : final;
            }
            return final;
        },
        handleArray: function (rootMeta, metaVer, final) {
            // @ts-ignore
            var arrProxyItemsList = rootMeta.proxyItemsMgr['Array'];
            var mayRootArr = [];
            arrProxyItemsList.forEach(function (proxyItems) {
                // @ts-ignore, 在 reassignGrandpaAndParent 做了标记
                if (proxyItems[isModifiedKey]) {
                    var proxyItemsMeta = getMeta(proxyItems, metaVer);
                    var items = (proxyItemsMeta === null || proxyItemsMeta === void 0 ? void 0 : proxyItemsMeta.copy) || proxyItems;
                    items.forEach(function (val, idx) {
                        var meta = getMeta(val, metaVer);
                        if (meta) {
                            mayRootArr[idx] = !meta.modified ? meta.self : meta.copy;
                        }
                        else {
                            mayRootArr[idx] = val;
                        }
                    });
                    // @ts-ignore
                    var itemsParent = items.__parent;
                    if (itemsParent) {
                        // @ts-ignore 将拆proxy后的结果指回去 CHANGED
                        itemsParent[items.__dataIndex] = mayRootArr;
                    }
                }
            });
            // 根对象就是 Array 时，直接将 final 指向可能做好的新 Array
            if (rootMeta.parentType === 'Array' && mayRootArr.length) {
                return mayRootArr;
            }
            return final;
        },
    };
    function buildLimuApis() {
        var limuApis = (function () {
            var metaVer = getMetaVer();
            var called = false;
            var revoke = null;
            var copyOnWriteTraps = {
                // parent指向的是代理之前的对象
                get: function (parent, key) {
                    if (key === verKey) {
                        return metaVer;
                    }
                    var currentChildVal = parent[key];
                    if (key === '__proto__' || key === finishHandler || key === isModifiedKey) {
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
                    var parentType = getDataNodeType(parent);
                    var parentMeta = getMeta(parent, metaVer);
                    console.log("Get parentType:".concat(parentType, " key:").concat(key, " "), 'Read KeyPath', getKeyPath(parent, key, metaVer));
                    // copyWithin、sort 、valueOf... will hit the keys of 'asymmetricMatch', 'nodeType',
                    // PROPERTIES_BLACK_LIST 里 'length', 'constructor', 'asymmetricMatch', 'nodeType'
                    // 是为了配合 data-node-processor 里的 ATTENTION_1
                    if (parentMeta && TYPE_BLACK_LIST.includes(parentType) && PROPERTIES_BLACK_LIST.includes(key)) {
                        return parentMeta.copy ? parentMeta.copy[key] : parentMeta.self[key];
                    }
                    // 第 2+ 次进入 key 的 get 函数，已为 parent 生成了代理
                    if (parentMeta) {
                        var self = parentMeta.self, copy = parentMeta.copy;
                        var originalChildVal = self[key];
                        if (!NO_CARE_COPY_TYPE_LIST.includes(parentType)) {
                            noop(metasKey, ensureDataNodeMetasProtoLayerFast);
                            // 存在 copy，则从 copy 上获取
                            if (copy) {
                                currentChildVal = copy[key];
                            }
                            // 产生了节点替换情况（此时currentChildVal应该是从 copy 里 获取的）
                            // 直接返回 currentChildVal 即可
                            // 因为 currentChildVal 已经是一个全新的值，无需对它做代理
                            // ori: { a: 1 },     cur: 1 
                            // ori: 1,            cur: { a: 1 } 
                            // ori: 1,            cur: 2 
                            // ori: { a: 1 }      cur: { a: 1 } 
                            if (originalChildVal !== currentChildVal) {
                                // console.log(` parentType${parentType} originalChildVal:${originalChildVal} currentChildVal:${currentChildVal}`);
                                // 返回出去的值因未做代理，之后对它的取值行为不会再进入到 get 函数中
                                // todo：后续版本考虑 createDraft 加参数来控制是否为这种已替换节点也做代理
                                if (Array.isArray(originalChildVal) && Array.isArray(currentChildVal)) {
                                    if (parentMeta && !currentChildVal[metasKey]) {
                                        var childMeta = getMeta(parent[key], metaVer);
                                        if (childMeta) {
                                            ensureDataNodeMetasProtoLayerFast(currentChildVal, metaVer);
                                            setMeta(currentChildVal, childMeta, metaVer);
                                            return childMeta.proxyVal;
                                        }
                                    }
                                }
                                return currentChildVal;
                            }
                        }
                    }
                    var createProxyVal = function (currentChildVal, copy, parentDataIdx) {
                        var _a, _b;
                        if (parentDataIdx === void 0) { parentDataIdx = -1; }
                        if (currentChildVal && !isPrimitive(currentChildVal)) {
                            var meta = getMeta(currentChildVal, metaVer);
                            if (!isFn(currentChildVal)) {
                                ensureDataNodeMetasProtoLayer(currentChildVal, metaVer);
                                // 惰性生成代理对象和其元数据
                                if (!meta) {
                                    meta = {
                                        rootMeta: null,
                                        parentMeta: null,
                                        parent: parent,
                                        parentType: parentType,
                                        selfType: getDataNodeType(currentChildVal),
                                        self: currentChildVal,
                                        key: key,
                                        idx: parentDataIdx,
                                        keyPath: getKeyPath(parent, parentDataIdx, metaVer),
                                        level: getNextMetaLevel(parent, metaVer),
                                        proxyVal: new Proxy(currentChildVal, copyOnWriteTraps),
                                        copy: copy,
                                        modified: false,
                                        proxyItems: null,
                                        proxyItemsMgr: null,
                                        finishDraft: noop,
                                        ver: metaVer,
                                    };
                                    var parentMeta_1 = getMeta(parent, metaVer);
                                    if (parentMeta_1) {
                                        meta.parentMeta = parentMeta_1;
                                        meta.rootMeta = parentMeta_1.rootMeta;
                                    }
                                    setMeta(currentChildVal, meta, metaVer);
                                }
                                // console.log('===> get keyPath(1) ', meta.keyPath, ' key is', key, ' val ', currentChildVal);
                                return meta.proxyVal;
                            }
                            else {
                                if (shouldGenerateProxyItems(parentType, key)) {
                                    meta = getMeta(parent, metaVer);
                                    if (!meta) {
                                        throw new Error('[[ createMeta ]]: oops, meta should not be null');
                                    }
                                    // console.log('===> get keyPath(2) ', meta.keyPath, ' key is', key);
                                    if (!meta.proxyItems) {
                                        // 提前完成遍历，为所有 item 生成代理
                                        var proxyItems = [];
                                        if (parentType === carefulDataTypes.Set) {
                                            var tmp_1 = new Set();
                                            parent.forEach(function (val) { return tmp_1.add(createProxyVal(val, tryMakeCopy(val))); });
                                            replaceSetOrMapMethods('Set', tmp_1, meta, parent, metaVer);
                                            proxyItems = tmp_1;
                                        }
                                        else if (parentType === carefulDataTypes.Map) {
                                            var tmp_2 = new Map();
                                            parent.forEach(function (val, key) { return tmp_2.set(key, createProxyVal(val, tryMakeCopy(val), key)); });
                                            replaceSetOrMapMethods('Map', tmp_2, meta, parent, metaVer);
                                            proxyItems = tmp_2;
                                        }
                                        else if (parentType === carefulDataTypes.Array) {
                                            var tmp_3 = [];
                                            var forEachTarget = meta.copy || parent;
                                            meta.copy = tmp_3;
                                            forEachTarget.forEach(function (val, idx) { return tmp_3.push(createProxyVal(val, tryMakeCopy(val), idx)); });
                                            proxyItems = meta.proxyVal;
                                        }
                                        meta.proxyItems = proxyItems;
                                        var targetMgr = (_b = (_a = meta.rootMeta) === null || _a === void 0 ? void 0 : _a.proxyItemsMgr) === null || _b === void 0 ? void 0 : _b[parentType];
                                        if (targetMgr) {
                                            targetMgr.push(proxyItems);
                                        }
                                    }
                                }
                                return currentChildVal;
                            }
                        }
                        return currentChildVal;
                    };
                    // 可能会指向代理对象
                    currentChildVal = createProxyVal(currentChildVal, null, key);
                    var toReturn;
                    // 用下标取数组时，可直接返回
                    // 例如数组操作: arrDraft[0].xxx = 'new'， 此时 arrDraft[0] 需要操作的是代理对象
                    if (parentType === carefulDataTypes.Array && canBeNum(key)) {
                        toReturn = currentChildVal;
                    }
                    else if (carefulDataTypes[parentType]) {
                        toReturn = copyAndGetDataNode(parent, { parentType: parentType, op: key, key: key, value: currentChildVal, metaVer: metaVer, calledBy: 'get' }, true);
                    }
                    else {
                        toReturn = currentChildVal;
                    }
                    return toReturn;
                },
                // parent 指向的是代理之前的对象
                set: function (parent, key, value) {
                    console.log('Set ', parent, key, value, 'Set KeyPath', getKeyPath(parent, key, metaVer));
                    if (key === isModifiedKey) {
                        parent.__proto__[isModifiedKey] = value;
                        return true;
                    }
                    // speed up array operation
                    var meta = getMeta(parent, metaVer);
                    if (meta) {
                        // @ts-ignore
                        if (meta.copy && meta.__callSet && meta.selfType === carefulDataTypes.Array && canBeNum(key)) {
                            meta.copy[key] = value;
                            return true;
                        }
                        // @ts-ignore
                        meta.__callSet = true;
                    }
                    copyAndGetDataNode(parent, { key: key, value: value, metaVer: metaVer, calledBy: 'set' }, true);
                    // if (meta) {
                    //   // console.log('set meta.keyPath ', [...meta.keyPath, key], ' key is', key, ' value is', value);
                    // }
                    return true;
                },
                deleteProperty: function (parent, key) {
                    // console.log('Delete ', parent, key);
                    copyAndGetDataNode(parent, { op: 'del', key: key, value: '', metaVer: metaVer, calledBy: 'deleteProperty' }, true);
                    return true;
                },
                // trap function call
                apply: function (target, thisArg, argumentsList) {
                    // console.log(`Apply `, target, thisArg, argumentsList);
                    // expected output: "Calculate sum: 1,2"
                    // return target(argumentsList[0], argumentsList[1]) * 10;
                    return target.apply(thisArg, argumentsList);
                },
            };
            return {
                createDraft: function (mayDraft) {
                    if (called) {
                        throw new Error('can not call new Limu().createDraft twice');
                    }
                    var baseState = mayDraft;
                    called = true;
                    if (isDraft$1(mayDraft)) {
                        var draftMeta = getMetaForDraft(mayDraft, mayDraft[verKey]);
                        // @ts-ignore
                        baseState = draftMeta.self;
                    }
                    ensureDataNodeMetasProtoLayer(baseState, metaVer, true);
                    var meta = getMeta(baseState, metaVer);
                    if (!meta) {
                        var baseStateType = getDataNodeType(baseState);
                        meta = {
                            rootMeta: null,
                            parent: null,
                            parentMeta: null,
                            parentType: baseStateType,
                            selfType: baseStateType,
                            self: baseState,
                            copy: null,
                            modified: false,
                            key: '',
                            keyPath: [],
                            idx: -1,
                            level: 0,
                            proxyVal: null,
                            proxyItems: null,
                            proxyItemsMgr: {
                                Map: [],
                                Set: [],
                                Array: [],
                            },
                            finishDraft: limuApis.finishDraft,
                            ver: metaVer,
                        };
                        meta.rootMeta = meta;
                        setMeta(baseState, meta, metaVer);
                    }
                    var _a = Proxy.revocable(baseState, copyOnWriteTraps), proxyDraft = _a.proxy, revokeHandler = _a.revoke;
                    meta.proxyVal = proxyDraft;
                    revoke = revokeHandler;
                    return proxyDraft;
                },
                // finishDraft: (proxyDraft, options = {}) => {
                finishDraft: function (proxyDraft) {
                    // attention: if pass a revoked proxyDraft
                    // it will throw: Cannot perform 'set' on a proxy that has been revoked
                    // 再次检查，以免用户是用 new Limu() 返回的 finishDraft 
                    // 去结束另一个 new Limu() createDraft 的 草稿对象
                    if (metaVer !== proxyDraft[verKey]) {
                        throw new Error('oops, the input draft does not match finishDraft handler');
                    }
                    var rootMeta = getMetaForDraft(proxyDraft, metaVer);
                    if (!rootMeta) {
                        throw new Error('oops, rootMeta should not be null!');
                    }
                    var final = rootMeta.self;
                    // 有 copy 不一定有修改行为，这里需做双重判断
                    if (rootMeta.copy && rootMeta.modified) {
                        final = rootMeta.copy;
                        final = inner.handleMap(rootMeta, metaVer, final);
                        final = inner.handleSet(rootMeta, metaVer, final);
                        final = inner.handleArray(rootMeta, metaVer, final);
                    }
                    // todo: 留着这个参数，解决多引用问题
                    // var base = { a: { b: { c: 1 } }, b: null };
                    // base.b = base.a.b;
                    // var im = new Limu();
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
        return limuApis;
    }

    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Tencent Corporation. All rights reserved.
     *  Licensed under the MIT License.
     *--------------------------------------------------------------------------------------------*/
    var Limu = /** @class */ (function () {
        function Limu() {
            var limuApis = buildLimuApis();
            this.createDraft = limuApis.createDraft;
            // @ts-ignore
            this.finishDraft = limuApis.finishDraft;
        }
        return Limu;
    }());
    function createDraft(base) {
        var apis = new Limu();
        return apis.createDraft(base);
    }
    function finishDraft(draft) {
        var draftMeta = getMetaForDraft(draft, draft[verKey]);
        var finishHandler = null;
        // @ts-ignore
        if (draftMeta)
            finishHandler = draftMeta.finishDraft;
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
    function innerProduce(baseState, cb) {
        checkCbFn(cb);
        var draft = createDraft(baseState);
        var result = cb(draft);
        checkCbPromise(cb, result);
        return finishDraft(draft);
    }
    var produceFn = function (baseState, cb) {
        if (!cb) {
            // expect baseState to be a callback, support curried invocation
            checkCbFn(baseState);
            return function (state) {
                return innerProduce(state, baseState);
            };
        }
        return innerProduce(baseState, cb);
    };
    function getDraftMeta(proxyDraft) {
        var ver = proxyDraft[verKey];
        return getMetaForDraft(proxyDraft, ver);
    }
    var isDraft = isDraft$1;
    var produce = produceFn;

    exports.Limu = Limu;
    exports.createDraft = createDraft;
    exports.finishDraft = finishDraft;
    exports.getDraftMeta = getDraftMeta;
    exports.isDraft = isDraft;
    exports.produce = produce;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
