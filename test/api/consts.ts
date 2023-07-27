import * as consts from '../../src/support/consts';
import '../_util';

describe('check consts', () => {
  test('CAREFUL_TYPES', () => {
    expect(consts.CAREFUL_TYPES.Array).toBe('Array');
    expect(consts.CAREFUL_TYPES.Map).toBe('Map');
    expect(consts.CAREFUL_TYPES.Set).toBe('Set');
  });

  test('other', () => {
    expect(consts.OBJ_DESC).toBe('[object Object]');
    expect(consts.MAP_DESC).toBe('[object Map]');
    expect(consts.SET_DESC).toBe('[object Set]');
    expect(consts.ARR_DESC).toBe('[object Array]');
    expect(consts.FN_DESC).toBe('[object Function]');

    expect(consts.desc2dataType['[object Map]']).toBe('Map');
    expect(consts.desc2dataType['[object Set]']).toBe('Set');
    expect(consts.desc2dataType['[object Array]']).toBe('Array');
    expect(consts.desc2dataType['[object Object]']).toBe('Object');
  });
});
