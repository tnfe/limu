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
  ST1: '1', // autoFreeze: false opArr: false
  ST2: '2', // autoFreeze: false opArr: true
  ST3: '3', // autoFreeze: true  opArr: false
  ST4: '4', // autoFreeze: true  opArr: true
};

// ************************************************************************
const curStrategy = process.env.ST || strategyConsts.ST1;
// change params 'hasArr'、'lessDeepOp' to test limu and immer performance in different situations
// then run npm cmd: `npm run s1`、`npm run s2` to see perf result
const MORE_DEEP_OP = true; // has more deep operation or not
// ************************************************************************
// hasArr = true; lessDeepOp = false; limu close to native

const sc = strategyConsts;
const stategies = {
  [sc.ST1]: [false, false],
  [sc.ST2]: [false, true],
  [sc.ST3]: [true, false],
  [sc.ST4]: [true, true],
};
const AUTO_FREEZE = stategies[curStrategy][0];
const OP_ARR = stategies[curStrategy][1]; // operate arr or not

immer.setAutoFreeze(AUTO_FREEZE);
limu.setAutoFreeze(AUTO_FREEZE);

function getBase(arrLen = ARR_LEN) {
  return util.getBase(arrLen, false);
}

function oneBenchmark(libName, options) {
  const { userBenchmark, arrLen } = options;
  let lib = immutLibs[libName];
  const base = getBase(arrLen);
  const start = Date.now();
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
  const { arrLen = ARR_LEN } = options;
  console.log(`autoFreeze ${AUTO_FREEZE}, opArr ${OP_ARR}, moreDeepOp ${MORE_DEEP_OP}, arrLen ${arrLen}`);
  util.showMem('Before measure', true);

  measureBenchmark('immer', options);
  // speedup at: node caseOnlyRead.js
  measureBenchmark('limuFast', options);
  measureBenchmark('limu', options);// now fastRangeMode is array by default
  measureBenchmark('pstr', options);
  measureBenchmark('native', options);

  // see if mem leak or not
  console.log('');
  for (let i = 0; i < 2; i++) {
    await util.sleep();
    util.showMem(`After ${5000 * (i + 1)} ms`);
  }
};
