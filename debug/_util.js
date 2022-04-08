const limu = require('../dist/limu');

// const limu = require('immer');
// limu.enableMapSet();

exports.createDraft = limu.createDraft;

exports.finishDraft = limu.finishDraft;

exports.produce = limu.produce;

let RUN_PRODUCE = false;

exports.setRunProduce = function setRunProduce(val) {
  RUN_PRODUCE = val;
}

exports.getArrBase = function setRunProduce(val) {
  return [1, 2, 3];
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


exports.expect = function (input) {
  return {
    toBeTruthy: () => {
      const mayTrue = input;
      if (!mayTrue) throw new Error('false');
    },
    toMatchObject: (matchObj) => {
      if (JSON.stringify(input) !== JSON.stringify(matchObj)) throw new Error('false');
    },
  };
}
