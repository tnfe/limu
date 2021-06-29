import {
  runMapTestSuit, getMapBase,
  // shouldBeEqual,
  // shouldBeNotEqual,
} from '../_util';

// function doNothingInForEach(mapDraft: Map<any, any>) {
//   mapDraft.forEach((val, key) => {
//     noop(val, key);
//   });
// }

// runMapTestSuit('test map forEach', 'forEach', getMapBase, doNothingInForEach, shouldBeEqual);

function changeMapInForEach(mapDraft: Map<any, any>) {
  mapDraft.forEach((val, key) => {
    console.log(`change ${key} value ${val}`);
    mapDraft.set(key, `new_${val}`);
  });

  // todo: 待解决，支持取 callback里的map修改
  // mapDraft.forEach((val, key, map) => {
  //   console.log(`change ${key} value ${val}`);
  //   map.set(key, `new_${val}`);
  // });
}

function compare(mapNew, mapBase) {
  console.log('mapNew', mapNew);
  console.log('mapBase', mapBase);
  expect(mapNew !== mapBase).toBeTruthy();
}

runMapTestSuit('test map forEach, change item', 'forEach', getMapBase, changeMapInForEach, compare);
