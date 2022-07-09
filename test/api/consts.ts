import * as consts from '../../src/support/consts';

describe('check consts', () => {
  test('carefulDataTypes', () => {
    expect(consts.carefulDataTypes.Array).toBe('Array');
    expect(consts.carefulDataTypes.Map).toBe('Map');
    expect(consts.carefulDataTypes.Set).toBe('Set');
  });

  test('other', () => {
    console.log('=======> other');
    expect(consts.objDesc).toBe('[object Object]');
    expect(consts.mapDesc).toBe('[object Map]');
    expect(consts.setDesc).toBe('[object Set]');
    expect(consts.arrDesc).toBe('[object Array]');
    expect(consts.fnDesc).toBe('[object Function]');

    expect(consts.desc2dataType['[object Map]']).toBe('Map');
    expect(consts.desc2dataType['[object Set]']).toBe('Set');
    expect(consts.desc2dataType['[object Array]']).toBe('Array');
    expect(consts.desc2dataType['[object Object]']).toBe('Object');
  });

});