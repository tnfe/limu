import * as util from '../../src/support/util';

describe('check util', () => {
  test('isObject', () => {
    expect(util.isObject(1)).toBeFalsy();
  });

  test('isMap', () => {
    expect(util.isMap(1)).toBeFalsy();
  });

  test('noop', () => {
    expect(util.noop(false)).toMatchObject([false]);
  });

  test('canBeNum', () => {
    expect(util.canBeNum('1')).toBeTruthy();
  });

  test('canBeNum', () => {
    expect(util.canBeNum(undefined)).toBeFalsy();
  });

  test('canBeNum', () => {
    expect(util.canBeNum(1)).toBeTruthy();
  });

  test('isSymbol', () => {
    expect(util.isSymbol('1')).toBeFalsy();
  });

  test('isPromiseResult', () => {
    expect(util.isPromiseResult('1')).toBeFalsy();
  });

  test('isPromiseFn', () => {
    expect(util.isPromiseFn('1')).toBeFalsy();
  });

  test('isPrimitive', () => {
    expect(util.isPrimitive({ a: 1 })).toBeFalsy();
  });

  test('getValStrDesc', () => {
    expect(util.getValStrDesc({ a: 1 })).toBe('[object Object]');
  });

  test('isFn', () => {
    expect(util.isFn({ a: 1 })).toBeFalsy();
  });

  test('isFn', () => {
    expect(util.isFn(() => 2)).toBeTruthy();
  });

});