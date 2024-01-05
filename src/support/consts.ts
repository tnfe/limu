/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { DataType } from '../inner-types';

/**
 * 因 3.0 做了大的架构改进，让其行为和 immer 保持了 100% 一致，和 2.0 版本处于不兼容状态
 * 此处标记版本号辅助测试用例为2.0走一些特殊逻辑
 */
export const LIMU_MAJOR_VER = 3;

export const VER = '3.12.0';

/** meta 数据key，仅 debug 模式才挂到对象的原型上 */
export const META_KEY = Symbol('M');

/** 版本号key */
export const META_VER = Symbol('V');

export const IMMUT_BASE = Symbol('IMMUT_BASE');

/** markRaw 调用会给对象标记 IS_RAW 为 true */
export const IS_RAW = Symbol('IS_RAW');

export const MAP = 'Map';
export const SET = 'Set';
export const ARRAY = 'Array';
export const OBJECT = 'Object';

/**
 * limu 需要关心的 symbol 读取 key 列表
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
 */
export const JS_SYM_KEYS = [Symbol.iterator, Symbol.toStringTag]

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
