import { innerUtil } from '../../src';

describe('check apis', () => {
  test('innerUtil', () => {
    expect(innerUtil).toBeTruthy();
    expect(innerUtil.canBeNum).toBeInstanceOf(Function);
    expect(innerUtil.isFn).toBeInstanceOf(Function);
    expect(innerUtil.isMap).toBeInstanceOf(Function);
    expect(innerUtil.isObject).toBeInstanceOf(Function);
    expect(innerUtil.isPrimitive).toBeInstanceOf(Function);
    expect(innerUtil.isPromiseFn).toBeInstanceOf(Function);
    expect(innerUtil.isPromiseResult).toBeInstanceOf(Function);
    expect(innerUtil.isSet).toBeInstanceOf(Function);
    expect(innerUtil.isSymbol).toBeInstanceOf(Function);
    expect(innerUtil.noop).toBeInstanceOf(Function);
  });
});
