import '../_util';
import * as helper from '../../src/core/helper';
import * as copy from '../../src/core/copy';

describe('check helper', () => {
  test('tryMakeCopy', () => {
    expect(helper.shouldGenerateProxyItems('Array', 'key')).toBeTruthy();
  });
  test('tryMakeCopy', () => {
    const mapBase = new Map();
    const mapCopy = copy.tryMakeCopy(mapBase);
    expect(mapBase !== mapCopy).toBeTruthy();

    const arrBase = [];
    const arrCopy = copy.tryMakeCopy(arrBase);
    expect(arrBase !== arrCopy).toBeTruthy();

    const setBase = new Set();
    const setCopy = copy.tryMakeCopy(setBase);
    expect(setBase !== setCopy).toBeTruthy();

    const objBase = {};
    const objCopy = copy.tryMakeCopy(objBase);
    expect(objBase !== objCopy).toBeTruthy();

    const numBase = 2;
    const numCopy = copy.tryMakeCopy(numBase);
    expect(numBase === numCopy).toBeTruthy();
  });

});
