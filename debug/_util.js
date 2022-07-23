
// const limu = require('immer'); limu.enableMapSet(); console.log('\nRUN IMMER !!!\n');
const limu = require('../dist/limu'); console.log('\nRUN LIMU !!!\n');

// print bad ( new arch )

// const limu = require('./limus/2.0.2-beta/limu');

// print bad ( new arch )
// const limu = require('../dist/limu');
// print well
// const limu = require('./limus/2.0.2-limuKey/limu');
// const limu = require('./limus/2.0.2-limuKey-v2/limu');
// const limu = require('./limus/3.0.0-fast/limu');

// print bad
// const limu = require('immer');
// limu.enableMapSet();

exports.Limu = limu.Limu;

exports.createDraft = limu.createDraft;

exports.finishDraft = limu.finishDraft;

exports.produce = limu.produce;

exports.setAutoFreeze = limu.setAutoFreeze;

exports.isNewArch = () => (limu.getMajorVer ? limu.getMajorVer() >= 3 : true);

exports.assignFrozenDataInJest = function (cb) {
  try {
    cb();
  } catch (e) {
    // jest will throw the error below from jest-circus/build/utils.js
    // Cannot assign to read only property 'key' of object '#<Object>'
    expect(e.message).toMatch('Cannot');
  }
};

exports.strfy = (obj, space) => JSON.stringify(obj, null, space ?? 0);

exports.logStr = (obj, space) => console.log(exports.strfy(obj, space));

exports.logLabeledStr = (label, obj, space) => console.log(label, exports.strfy(obj, space));

let RUN_PRODUCE = false;
const createDraft = exports.createDraft;
const finishDraft = exports.finishDraft;

exports.noop = function noop(...args) {
  return args;
}

exports.setRunProduce = function setRunProduce(val) {
  RUN_PRODUCE = val;
}

exports.getSetBase = function setRunProduce(val) {
  return new Set([1, 2, 3]);
}

exports.getArrBase = function setRunProduce(val) {
  return [1, 2, 3];
}


exports.getMapBase = function getMapBase() {
  return new Map([
    ['k1', 1],
    ['k2', 2],
    ['k3', 3],
  ]);
}


exports.getMapObjBase = function getMapObjBase() {
  return new Map([
    ['k1', { name: 'k1' }],
    ['k2', { name: 'k2' }],
    ['k3', { name: 'k3' }],
  ]);
}


exports.shouldBeEqual = function shouldBeEqual(stateNew, stateBase) {
  expect(stateNew === stateBase).toBeTruthy();
}

exports.shouldBeNotEqual = function shouldBeNotEqual(stateNew, stateBase) {
  expect(stateNew !== stateBase).toBeTruthy();
}

exports.runTestSuit = function runTestSuit(
  testSuitDesc,
  testCaseDesc,
  getBase,
  operateDraft,
  executeAssertLogic,
  skip,
) {
  if (skip) return;
  const base = getBase();
  const draft = limu.createDraft(base);
  operateDraft(draft, base);
  const final = limu.finishDraft(draft);
  if (executeAssertLogic) executeAssertLogic(final, base);

  if (RUN_PRODUCE) {
    const base = getBase();
    const final = limu.produce(base, draft => {
      operateDraft(draft, base);
    });
    if (executeAssertLogic) executeAssertLogic(final, base);
  }
}

const produceTip = (testDescribe) => `${testDescribe} (with produce)`;

const createDraftTip = (testDescribe) => `${testDescribe} (with createDraft, finishDraft)`;

exports.runObjectTestSuit = function runObjectTestSuit(
  testSuitDesc,
  testCaseDesc,
  getObjectBase,
  operateDraft,
  executeAssertLogic
) {
  describe(testSuitDesc, () => {
    test(createDraftTip(testCaseDesc), () => {
      const objBase = getObjectBase();
      const objDraft = createDraft(objBase);
      operateDraft(objDraft, objBase);
      const objNew = finishDraft(objDraft);
      executeAssertLogic(objNew, objBase);
    });

    if (RUN_PRODUCE) {
      test(produceTip(testCaseDesc), () => {
        const objBase = getObjectBase();
        const objNew = produce(objBase, objDraft => {
          operateDraft(objDraft, objBase);
        });
        executeAssertLogic(objNew, objBase);
      });
    }
  })
}


exports.logAsStr = function (obj) {
  if (typeof obj === 'string') {
    console.log(obj);
    return;
  }
  console.log(JSON.stringify(obj, null, 2));
}


exports.exceptToBe = function (ac, ex) {
  console.log('actual: ', ac);
  console.log('except: ', ex);
  console.log('-------------');
}


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
    toEqual(ex) {
      if (ac !== ex) {
        throw new Error(`actual is ${ac}, excpect to equal ${ex}`);
      }
    },
    toBeTruthy: () => {
      const mayTrue = ac;
      if (!mayTrue) throw new Error('toBeTruthy fail');
    },
    toBeFalsy: () => {
      const mayFlase = ac;
      if (!!mayFlase) throw new Error('toBeFalsy fail');
    },
    toMatch: (matchStr) => {
      /** @type string */
      const str = ac;
      if (typeof ac === 'string' && typeof matchStr === 'string' && !str.includes(matchStr)) {
        throw new Error(`actual is ${ac}, excpect to match ${matchStr}`);
      } else {
        throw new Error(`actual or matchStr type [ ${typeof ac} ${typeof matchStr} ] wrong`);
      }
    },
    toMatchObject: (matchObj) => {
      const strAc = JSON.stringify(ac);
      const strMatchObj = JSON.stringify(matchObj);
      if (strAc !== strMatchObj) {
        console.log('expect: ', strMatchObj);
        console.log('actual: ', strAc);
        throw new Error('toMatchObject false');
      }
    },
  };
}
