/**
 * inspired by https://github.com/immerjs/immer/blob/main/__performance_tests__/add-data.mjs
 */
const { measure } = require('./_immerUtil');
const { getBtyeLen } = require('./_util');
const immer = require('immer');
// const limu = require('limu');
const { limu } = require('./libs/limu');
const { getData } = require('./dataSource');

const { produce, setAutoFreeze, setUseProxies, enableAllPlugins, original, isDraft } = immer;
enableAllPlugins();

const dataSet = getData();
console.log(`dataSet byteSize: ${getBtyeLen(dataSet)}`);

function runBenchmark(initializeData = true) {
  if (initializeData) {
    console.log('\n assign big list to base');
  } else {
    console.log('\n assign big list to draft');
  }

  const baseState = {
    data: initializeData ? getData() : null,
    list: [{ id: 'test' }],
  };
  const MAX = 100;

  const getRecipe = (lib, isDraft) => (draft) => {
    if (!initializeData) {
      draft.data = getData();
    }
    draft.data.forEach((item) => (item.guid = 'test'));
  };
  const immerRecipe = getRecipe(immer, immer.isDraft);
  const limuRecipe = getRecipe(limu, limu.limuUtils.isDraft);

  function readOnlyErr(cb) {
    try {
      cb();
    } catch (err) {
      if (!err.message.includes('Cannot assign to read only property')) {
        throw new Error('catch fail');
      }
    }
  }

  const checkFrozen = (next) => {
    readOnlyErr(() => {
      next.data[0].guid = 'test_new';
    });
    if (next.data[0].guid === 'test_new') {
      console.log('next.data[0].guid: ', next.data[0].guid);
      throw new Error('frozen failed');
    }
  };

  const checkUnfrozen = (next) => {
    next.data[0].guid = 'test_new';
    if (next.data[0].guid !== 'test_new') {
      throw new Error('unfrozen failed');
    }
  };

  measure('immer (proxy) - without autofreeze * ' + MAX, () => {
    setUseProxies(true);
    setAutoFreeze(false);
    for (let i = 0; i < MAX; i++) {
      const next = produce(baseState, immerRecipe);
      checkUnfrozen(next);
    }
  });

  measure('limu (proxy) - without autofreeze * ' + MAX, () => {
    for (let i = 0; i < MAX; i++) {
      const next = limu.produce(baseState, limuRecipe, { fastModeRange: 'all' });
      checkUnfrozen(next);
    }
  });

  measure('immer (proxy) - with autofreeze * ' + MAX, () => {
    setUseProxies(true);
    setAutoFreeze(true);
    for (let i = 0; i < MAX; i++) {
      const next = produce(baseState, immerRecipe);
      checkFrozen(next);
    }
  });

  measure('limu (proxy) - with autofreeze * ' + MAX, () => {
    for (let i = 0; i < MAX; i++) {
      const next = limu.produce(baseState, limuRecipe, { fastModeRange: 'all', autoFreeze: true });
      checkFrozen(next);
    }
  });
}

runBenchmark(true); // init big list at base
runBenchmark(false); // assign big list to draft
