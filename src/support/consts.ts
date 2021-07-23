
export const carefulDataTypes = {
  Map: 'Map',
  Set: 'Set',
  Array: 'Array',
};

export const objDesc = '[object Object]';

export const mapDesc = '[object Map]';

export const setDesc = '[object Set]';

export const arrDesc = '[object Array]';

export const fnDesc = '[object Function]';

export const desc2dataType = {
  [mapDesc]: carefulDataTypes.Map,
  [setDesc]: carefulDataTypes.Set,
  [arrDesc]: carefulDataTypes.Array,
  [objDesc]: 'Object',
};



export const arrFnKeys = [
  'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'flat', 'flatMap',
  'forEach', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf', 'map', 'pop', 'push', 'reduce', 'reduceRight',
  'reverse', 'shift', 'unshift', 'slice', 'some', 'sort', 'splice', 'values', 'valueOf',
];
export const arrFnKeysThatNeedMarkModified = [
  'concat', 'copyWithin', 'fill', 'flat', 'flatMap', 'pop', 'push', 'reverse', 'shift', 'unshift', 'splice',
];

export const mapFnKeys = ['clear', 'delete', 'entries', 'forEach', 'get', 'has', 'keys', 'set', 'values'];
export const mapFnKeysThatNeedMarkModified = [
  'clear', 'delete', 'set',
];

export const setFnKeys = ['add', 'clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values'];
export const setFnKeysThatNeedMarkModified = [
  'add', 'clear', 'delete',
];

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

export const carefulType2fnKeys = {
  [carefulDataTypes.Map]: mapFnKeys,
  [carefulDataTypes.Set]: setFnKeys,
  [carefulDataTypes.Array]: arrFnKeys,
};

export const carefulType2fnKeysThatNeedMarkModified = {
  [carefulDataTypes.Map]: mapFnKeysThatNeedMarkModified,
  [carefulDataTypes.Set]: setFnKeysThatNeedMarkModified,
  [carefulDataTypes.Array]: arrFnKeysThatNeedMarkModified,
};

export const carefulType2proxyItemFnKeys = {
  [carefulDataTypes.Map]: ['forEach', 'get'],
  [carefulDataTypes.Set]: ['forEach'],
  [carefulDataTypes.Array]: ['forEach', 'map'],
};
