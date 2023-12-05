import { immut, limuUtils } from '../../src';
import { dictFictory } from '../_data';

describe('check onOperate', () => {
  // @see 3.11.1 commit msg: https://github.com/tnfe/limu/commit/98b7c3ed2834b3c7ed0c3ceefcd7d6afb73d9329
  test('onOperate: immut map', () => {
    const base = dictFictory();
    const draft = immut(base);
    limuUtils.noop(draft.extra.map.get(1));
    expect(limuUtils.has(draft.extra.map, 1)).toBeFalsy();
    expect(limuUtils.has(draft.extra.map, 2)).toBeFalsy();
  });
});
