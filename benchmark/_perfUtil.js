const immer = require('./libs/immer');
const { limu, limuFast, limuSlow } = require('./libs/limu');
const pstr = require('./libs/pstr');
const native = require('./libs/native');
const util = require('./_util');

const immutLibs = {
  immer,
  limu,
  limuFast,
  limuSlow,
  pstr,
  native, // just to see native js operation perf
};
const LOOP_LIMIT = 500;
const ARR_LEN = 10000;
const strategyConsts = {
  BASE_T_AUTO_T: '1', // reuseBase: true   autoFreeze: true
  BASE_F_AUTO_T: '2', // reuseBase: false  autoFreeze: true
  BASE_T_AUTO_F: '3', // reuseBase: true   autoFreeze: false
  BASE_F_AUTO_F: '4', // reuseBase: false  autoFreeze: false
};

// ************************************************************************
const curStrategy = process.env.ST || strategyConsts.BASE_F_AUTO_F;
// change params 'hasArr'、'lessDeepOp' to test limu and immer performance in different situations
// then run npm cmd: `npm run s1`、`npm run s2`、`npm run s3`、`npm run s4` to see perf result
const OP_ARR = true; // operate arr or not
const MORE_DEEP_OP = true; // has more deep operation or not
// ************************************************************************
// hasArr = true; lessDeepOp = false; limu close to native

const sc = strategyConsts;
const stategies = {
  [sc.BASE_T_AUTO_T]: [true, true],
  [sc.BASE_F_AUTO_T]: [false, true],
  [sc.BASE_T_AUTO_F]: [true, false],
  [sc.BASE_F_AUTO_F]: [false, false],
};
const REUSE_BASE = stategies[curStrategy][0];
const AUTO_FREEZE = stategies[curStrategy][1];

immer.setAutoFreeze(AUTO_FREEZE);
limu.setAutoFreeze(AUTO_FREEZE);

function getBase(arrLen = ARR_LEN) {
  return util.getBase(arrLen, false);
}

let baseDataMap = null;
function getBaseDataMap(arrLen) {
  if (!baseDataMap) {
    baseDataMap = {
      immer: getBase(arrLen),
      limu: getBase(arrLen),
      limuFast: getBase(arrLen),
      limuSlow: getBase(arrLen),
      pstr: getBase(arrLen),
      native: getBase(arrLen),
    };
  }
  return baseDataMap;
}

function oneBenchmark(libName, options) {
  const { reuseBase = REUSE_BASE, userBenchmark, arrLen } = options;
  const start = Date.now();
  let lib = immutLibs[libName];
  if (libName === 'mutative') {
    lib = AUTO_FREEZE ? lib.libAuto : lib.lib;
  }

  const base = reuseBase ? getBaseDataMap(arrLen)[libName] : getBase(arrLen);
  userBenchmark({
    libName,
    lib,
    base,
    operateArr: OP_ARR,
    moreDeepOp: MORE_DEEP_OP,
  });
  const taskSpend = Date.now() - start;

  return taskSpend;
}

/**
 * @param {string} libName
 */
function measureBenchmark(libName, options) {
  const loopLimit = options.loopLimit || LOOP_LIMIT;

  let totalSpend = 0;
  const runForLoop = (limit) => {
    for (let i = 0; i < limit; i++) {
      totalSpend += oneBenchmark(libName, options);
    }
  };
  // preheat
  oneBenchmark(libName, options);
  runForLoop(loopLimit);
  console.log(`loop: ${loopLimit}, ${libName} avg spend ${totalSpend / loopLimit} ms`);
}

/**
 * @param {object} options
 * @param {number} [options.loopLimit] - 循环次数
 * @param {number} [options.arrLen] - 数组长度
 * @param {boolean} [options.reuseBase] - 是否复用base
 * @param {(params: {lib: typeof limu, base:any, operateArr:boolean, moreDeepOp:boolean })=>void} options.userBenchmark - 是否复用base
 */
exports.runPerfCase = async function (options) {
  const { reuseBase = REUSE_BASE, arrLen = ARR_LEN } = options;
  console.log(`reuseBase ${reuseBase}, autoFreeze ${AUTO_FREEZE}, hasArr ${OP_ARR}, moreDeepOp ${MORE_DEEP_OP}, arrLen ${arrLen}`);
  util.showMem('Before measure', true);

  measureBenchmark('immer', options);
  // speedup at: node caseOnlyRead.js
  // measureBenchmark('limuFast', options);
  measureBenchmark('limu', options);// now fastRangeMode is array
  measureBenchmark('pstr', options);
  measureBenchmark('native', options);

  // see if mem leak or not
  console.log('');
  for (let i = 0; i < 2; i++) {
    await util.sleep();
    util.showMem(`After ${5000 * (i + 1)} ms`);
  }
};
