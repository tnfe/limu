
export const carefulDataTypes = {
  Map: 'Map',
  Set: 'Set',
  Array: 'Array',
};

export const objDesc = '[object Object]';

export const mapDesc = '[object Map]';

export const setDesc = '[object Set]';

export const arrDesc = '[object Array]';

export const desc2dataType = {
  [mapDesc]: carefulDataTypes.Map,
  [setDesc]: carefulDataTypes.Set,
  [arrDesc]: carefulDataTypes.Array,
};

export const arrFnKeys = [
  'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'flat', 'flatMap',
  'forEach', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf', 'map', 'pop', 'push', 'reduce', 'reduceRight',
  'reverse', 'shift', 'unshift', 'slice', 'some', 'sort', 'splice', 'values', 'valueOf',
];

export const mapFnKeys = ['clear', 'delete', 'entries', 'forEach', 'get', 'has', 'keys', 'set', 'values'];

export const setFnKeys = ['add', 'clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values'];

// fill,push,pop,splice,shift,unshift should trigger copy, so they are not in arrIgnoreFnOrAttributeKeys

export const arrIgnoreFnOrAttributeKeys = [
  'length', 'forEach',
  'slice', 'concat', 'find', 'findIndex', 'filter', 'flat', 'flatMap', 'includes', 'reverse',
  'indexOf', 'every', 'some', 'constructor', 'join', 'keys', 'lastIndexOf', 'map', 'reduce',
  'reduceRight', 'sort', 'values', 'entries',
  'copyWithin', 'valueOf',
  // copyWithin、valueOf will hit the keys of next line
  'asymmetricMatch', 'nodeType',
];

export const mapIgnoreFnKeys = [
  'entries', 'keys', 'values', 'forEach',
];
export const mapIgnoreFnOrAttributeKeys = [
  ...mapIgnoreFnKeys,
  'size',
];

export const carefulType2FnKeys = {
  [carefulDataTypes.Map]: mapFnKeys,
  [carefulDataTypes.Set]: setFnKeys,
  [carefulDataTypes.Array]: arrFnKeys,
};
