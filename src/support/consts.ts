
export const carefulDataTypes = {
  Map: 'Map',
  Set: 'Set',
  Array: 'Array',
};

export const objDesc = '[object Object]';

export const mapDesc = '[object Map]';

export const setDesc = '[object Set]';

export const arrDesc = '[object Array]';

export const dataType2Desc = {
  [carefulDataTypes.Map]: mapDesc,
  [carefulDataTypes.Set]: setDesc,
  [carefulDataTypes.Array]: arrDesc,
};

// 因为map比较小，容易维护，这里就不写 map key value 反转逻辑来生成 desc2dataType 了
// 还能够提高 limu 的加载速度
export const desc2dataType = {
  [mapDesc]: carefulDataTypes.Map,
  [setDesc]: carefulDataTypes.Set,
  [arrDesc]: carefulDataTypes.Array,
};


export const arrFnKeys = [
  'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'flat', 'flatMap',
  'forEach', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf', 'map', 'pop', 'push', 'reduce', 'reduceRight',
  'reverse', 'shift', 'slice', 'some', 'sort', 'splice', 'unshift', 'values', 'valueOf',
];

export const mapFnKeys = ['clear', 'delete', 'entries', 'forEach', 'get', 'has', 'keys', 'set', 'values'];

export const setFnKeys = ['add', 'clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values'];
