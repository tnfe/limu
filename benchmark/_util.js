
const strfy = (obj) => JSON.stringify(obj);

exports.log = (obj) => console.log(strfy(obj));

exports.noop = () => true;

exports.showMem = function (label = 'Process', newLine = false) {
  var mem = process.memoryUsage();
  var format = function (bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };
  const info = `${label}: heapTotal ${format(mem.heapTotal)} heapUsed ${format(mem.heapUsed)} rss ${format(mem.rss)} external ${format(mem.external)}`;
  console.log(`${info}${newLine ? '\n' : ''}`);
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

function buildComplexObj() {
  return {
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
  };
};

function buildBase(arrLen = 10000) {
  const arr = Array(arrLen).fill(0).map((val, idx, arr) => arr[idx] = { a: 1 });
  return {
    arr,
    ...buildComplexObj(),
  };
}

const staticBase = buildBase();

exports.getBase = function (arrLen = 10000, static = false) {
  const base = static ? staticBase : buildBase(arrLen);
  return base;
}

exports.sleep = function (ms = 5000) {
  return new Promise(r => setTimeout(r, ms));
}

exports.die = function (label) {
  throw new Error(label);
};
