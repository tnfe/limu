/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { DataType } from '../inner-types';

/**
 * 4.0 开始，新增 keyPaths 支持多引用记录
 */
export const VER = '4.0.0';

/** meta 数据key，仅 debug 模式才挂到对象的原型上 (4.0+ 移除debug) */
export const META_KEY = Symbol('M');

/** 版本号key */
export const META_VER = Symbol('V');

/** 标识这是一个 immut 创建的根对象 */
export const IMMUT_BASE = Symbol('IMMUT_BASE');

/** markRaw 调用会给对象标记 IS_RAW 为 true */
export const IS_RAW = Symbol('IS_RAW');

/** 数据节点私有数据 */
export const PRIVATE_META = Symbol('P');

export const MAP = 'Map';
export const SET = 'Set';
export const ARRAY = 'Array';
export const OBJECT = 'Object';

/**
 * limu 需要关心的 symbol 读取 key 列表
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
 */
export const JS_SYM_KEYS = [Symbol.iterator, Symbol.toStringTag, IS_RAW];

export const CAREFUL_TYPES = { Map: MAP, Set: SET, Array: ARRAY } as const;

export const OBJ_DESC = '[object Object]';

export const MAP_DESC = '[object Map]';

export const SET_DESC = '[object Set]';

export const ARR_DESC = '[object Array]';

export const FN_DESC = '[object Function]';

export const desc2dataType: Record<string, DataType> = {
  [MAP_DESC]: MAP,
  [SET_DESC]: SET,
  [ARR_DESC]: ARRAY,
  [OBJ_DESC]: OBJECT,
};

export const SHOULD_REASSIGN_ARR_METHODS = ['push', 'pop', 'shift', 'splice', 'unshift', 'reverse', 'copyWithin', 'delete', 'fill'];

export const SHOULD_REASSIGN_MAP_METHODS = ['set', 'clear', 'delete'];

export const SHOULD_REASSIGN_SET_METHODS = ['add', 'clear', 'delete'];

export const CHANGE_ARR_ORDER_METHODS = ['splice', 'sort', 'unshift', 'shift'];

export const arrFnKeys = [
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

export const mapFnKeys = ['clear', 'delete', 'entries', 'forEach', 'get', 'has', 'keys', 'set', 'values'];

export const setFnKeys = ['add', 'clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values'];

export const CAREFUL_FNKEYS: Record<string, string[]> = {
  [MAP]: mapFnKeys,
  [SET]: setFnKeys,
  [ARRAY]: arrFnKeys,
};

export const CHANGE_FNKEYS: Record<string, string[]> = {
  [MAP]: ['clear', 'set', 'delete'],
  [SET]: ['clear', 'add', 'delete'],
  [ARRAY]: ['pop', 'push', 'shift', 'unshift', 'splice', 'sort', 'copyWithin'],
};

export const PROXYITEM_FNKEYS: Record<string, string[]> = {
  [MAP]: ['forEach', 'get'],
  [SET]: ['forEach'],
  [ARRAY]: ['forEach', 'map'],
};

export const OP_GET = 'get';

export const OP_SET = 'set';

export const OP_DEL = 'del';
