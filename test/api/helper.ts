import '../_util';
import * as helper from '../../src/core/helper';
import * as copy from '../../src/core/copy';
import { ARRAY, OBJECT } from '../../src/support/consts';

describe('check helper', () => {
  test('tryMakeCopy', () => {
    expect(helper.shouldGenerateProxyItems('Array', 'key')).toBeTruthy();
  });
  test('tryMakeCopy', () => {
    const fastModeRange = 'array';
    const mapBase = new Map();
    const { copy: mapCopy } = copy.tryMakeCopy(mapBase, { parentType: OBJECT, fastModeRange });
    expect(mapBase !== mapCopy).toBeTruthy();

    const arrBase = [];
    const { copy: arrCopy } = copy.tryMakeCopy(arrBase, { parentType: ARRAY, fastModeRange });
    expect(arrBase !== arrCopy).toBeTruthy();

    const setBase = new Set();
    const { copy: setCopy } = copy.tryMakeCopy(setBase, { parentType: OBJECT, fastModeRange });
    expect(setBase !== setCopy).toBeTruthy();

    const objBase = {};
    const { copy: objCopy } = copy.tryMakeCopy(objBase, { parentType: OBJECT, fastModeRange });
    expect(objBase !== objCopy).toBeTruthy();

    const numBase = 2;
    const { copy: numCopy } = copy.tryMakeCopy(numBase, { parentType: OBJECT, fastModeRange });
    expect(numBase === numCopy).toBeTruthy();
  });

});
