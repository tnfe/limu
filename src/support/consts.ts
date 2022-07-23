/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Tencent Corporation. All rights reserved.
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
export const oppositeOps = {
  add: 'remove',
  remove: 'add',
  set: 'delete',
  delete: 'set',
};

export const MAP = 'Map';
export const SET = 'Set';
export const ARRAY = 'Array';
export const OBJECT = 'Object';

export const carefulDataTypes = { Map: MAP, Set: SET, Array: ARRAY } as const;

export const objDesc = '[object Object]';

export const mapDesc = '[object Map]';

export const setDesc = '[object Set]';

export const arrDesc = '[object Array]';

export const fnDesc = '[object Function]';

export const desc2dataType = {
  [mapDesc]: MAP,
  [setDesc]: SET,
  [arrDesc]: ARRAY,
  [objDesc]: OBJECT,
};

export const SHOULD_REASSIGN_ARR_METHODS = ['push', 'pop', 'shift', 'splice', 'unshift', 'reverse', 'copyWithin', 'delete', 'fill'];

export const SHOULD_REASSIGN_MAP_METHODS = ['clear', 'delete', 'set'];

export const SHOULD_REASSIGN_SET_METHODS = ['add', 'clear', 'delete'];

export const arrFnKeys = [
  'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'flat', 'flatMap',
  'forEach', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf', 'map', 'pop', 'push', 'reduce', 'reduceRight',
  'reverse', 'shift', 'unshift', 'slice', 'some', 'sort', 'splice', 'values', 'valueOf',
];

export const mapFnKeys = ['clear', 'delete', 'entries', 'forEach', 'get', 'has', 'keys', 'set', 'values'];

export const setFnKeys = ['add', 'clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values'];

// fill,push,pop,splice,shift,unshift should trigger copy, so they are not in arrIgnoreFnOrAttributeKeys

export const arrFnKeysThatNoTriggerCopy = [
  'forEach', 'map',
];
export const arrIgnoreFnOrAttributeKeys = [
  // 'forEach', 'map', 'sort', 'copyWithin', 'reverse',
  'length',
  'slice', 'concat', 'find', 'findIndex', 'filter', 'flat', 'flatMap', 'includes',
  'indexOf', 'every', 'some', 'constructor', 'join', 'keys', 'lastIndexOf', 'reduce',
  'reduceRight', 'values', 'entries',
  'valueOf',
];

export const mapIgnoreFnKeys = [
  // 'forEach', 'get',
  'entries', 'keys', 'values', 'has',
];
export const mapIgnoreFnOrAttributeKeys = [
  ...mapIgnoreFnKeys,
  'size',
];

export const setIgnoreFnKeys = [
  // 'forEach',
  'entries', 'has', 'keys', 'values'
];
// export const setIgnoreFnKeys = ['entries', 'has', 'keys', 'values'];
export const setIgnoreFnOrAttributeKeys = [
  ...setIgnoreFnKeys,
  'size',
];

export const carefulFnKeys = {
  [carefulDataTypes.Map]: mapFnKeys,
  [carefulDataTypes.Set]: setFnKeys,
  [carefulDataTypes.Array]: arrFnKeys,
};

export const proxyItemFnKeys = {
  [carefulDataTypes.Map]: ['forEach', 'get'],
  [carefulDataTypes.Set]: ['forEach'],
  [carefulDataTypes.Array]: ['forEach', 'map'],
};
