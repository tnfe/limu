import { immut } from '../../src';

/**
 * test symbol operation
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
 */
describe('trigger read js internal symbol key', () => {
  // 3.11.7 优化 customKeys 逻辑后，js 内部 key 未拦截导致这里报错
  // throw err: Cannot convert a Symbol value to a string
  // 3.11.8 引入 JS_SYM_KEYS 做拦截判断
  test('Symbol.iterator', async () => {
    const state = immut({ val: new Set([1, 2, 3]) });
    expect(state).toBeTruthy();
    expect(state.val.size === 3).toBeTruthy();
    expect(Array.from(state.val)).toMatchObject([1, 2, 3]);
  });

  test('Symbol.asyncIterator', async () => {
    const state = immut({ val: async () => '1' });
    expect(state).toBeTruthy();
    const result = await state.val();
    expect(result).toBe('1');
  });

  test('test replace', async () => {
    const state = immut({ val: 'sss' });
    expect(state).toBeTruthy();
    expect(state.val.replace('sss', 'xxx')).toBe('xxx');
  });

  test('Symbol.prototype.description', async () => {
    const t = Symbol('t');
    const state = immut({ val: { [t]: 1 } });
    expect(state).toBeTruthy();
    expect(state.val[t]).toBe(1);
    expect(t.description).toBe('t');
  });
});
