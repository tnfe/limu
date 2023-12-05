import { immut, limuUtils } from '../../src';
import { dictFictory } from '../_data';

describe('check onOperate', () => {

  test('onOperate: immut map', () => {
    const base = dictFictory();
    const draft = immut(base);
    limuUtils.noop(draft.extra.map.get(1));
    expect(limuUtils.has(draft.extra.map, 1)).toBeFalsy();
    expect(limuUtils.has(draft.extra.map, 2)).toBeFalsy();
  });

});
