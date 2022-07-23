
const clone = obj => JSON.parse(JSON.stringify(obj));

const strfy = (obj) => JSON.stringify(obj);
exports.log = (obj) => console.log(strfy(obj));
exports.noop = () => true;

exports.showMem = function () {
  var mem = process.memoryUsage();
  var format = function (bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };
  console.log('Process: heapTotal ' + format(mem.heapTotal) + ' heapUsed ' + format(mem.heapUsed) + ' rss ' + format(mem.rss) + ' external:' + format(mem.external));
  console.log('-----------------------------------------------------------');
};

global.describe = function (label, cb) {
  cb();
}


global.test = function (label, cb) {
  console.log(`-------------- ${label} --------------`);
  cb();
  console.log(`-------------- pass ^_^ --------------\n`);
}


global.except = function (ac) {
  return {
    toBe(ex) {
      if (ac !== ex) {
        throw new Error(`actual is ${ac}, excpect to be ${ex}`);
      }
    },
  };
}


global.expect = function (ac) {
  return {
    toBe(ex) {
      if (ac !== ex) {
        throw new Error(`actual is ${ac}, excpect to be ${ex}`);
      }
    },
    toBeTruthy: () => {
      if (ac !== true) throw new Error('false');
    },
    toMatchObject: (matchObj) => {
      const strAc = JSON.stringify(ac);
      const strMatchObj = JSON.stringify(matchObj);
      if (strAc !== strMatchObj) {
        console.log('except: ', strMatchObj);
        console.log('actual: ', strAc);
        throw new Error('false');
      }
    },
  };
}

function getObjs() {
  const objs = {
    '1': {
      a: { b: { c: { d: { e: { f: { g: 1 } } } } } },
      a1: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a2: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a3: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a4: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a5: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a6: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a7: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      b: null,
      k1: { k1_1: 2 }, k2: { k2_1: 100 },
    },
    '2': {
      a: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a1: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a2: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a3: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a4: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a5: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a6: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a7: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      b: null,
      k1: { k1_1: 2 }, k2: { k2_1: 100 },
    },
    '3': {
      a: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: { o: { p: { q: { r: { s: { t: 1 } } } } } } } } } } } } } } } } } } },
      a1: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a2: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a3: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a4: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a5: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a6: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a7: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      b: null,
      k1: { k1_1: 2 }, k2: { k2_1: 100 },
    },
    '4': {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: {
                  g: {
                    h: {
                      i: {
                        j: {
                          k: {
                            l: {
                              m: {
                                n: {
                                  o: {
                                    p: {
                                      q: {
                                        r: {
                                          s: {
                                            t: { u: { v: { w: { x: { y: { z: 1 } } } } } }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      a1: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a2: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a3: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a4: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a5: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a6: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a7: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a8: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a9: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a10: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a11: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a12: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a13: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a14: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a15: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a16: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a17: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a18: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a19: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a20: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a21: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a22: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      a23: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
      b: null,
      k1: { k1_1: 2 }, k2: { k2_1: 100 },
    },
  };
  return objs;
};


function getObjArr() {
  const objs = getObjs();
  // const getItem = () => ({ a: 1 });

  const getArr = (len) => {
    // return Array(len).fill({ a: 1 });
    return Array(len).fill(0).map((val, idx, arr) => arr[idx] = { a: 1 });
  }

  const objArr = {
    1: {
      arr: getArr(2),
      ...clone(objs[1]),
    },
    2: {
      arr: getArr(100),
      ...clone(objs[2]),
    },
    3: {
      arr: getArr(1000),
      ...clone(objs[3]),
    },
    4: {
      arr: getArr(10000),
      ...clone(objs[4]),
    },
  };
  return objArr;
}

const staticObjs = getObjs();
const staticObjArr = getObjArr();

exports.getBase = function (complexity, static = false) {
  const objs = static ? staticObjs : getObjs();
  return objs[complexity] || objs[1];
}

exports.getBaseArr = function (complexity, static = false) {
  const objArr = static ? staticObjArr : getObjArr();
  return objArr[complexity] || objArr[1];
}
