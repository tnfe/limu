const lib = require('limu');
// make sure you've runned command `npm run build` at project root dir
// const lib = require('../../dist/limu.js');
// console.log('read dist limu');

console.log('process.env.DISABLE_REVOKE', process.env.DISABLE_REVOKE);
console.log('process.env.ST', process.env.ST);
const autoRevoke = process.env.DISABLE_REVOKE === '1' ? false : true;

const limuDebug = {
  ...lib,
  createDraft(base, options) {
    return lib.createDraft(base, { debug: true, fastModeRange: 'all', ...(options || {}), autoRevoke });
  },
  produce(base, draftCb, options) {
    return lib.produce(base, draftCb, {
      fastModeRange: 'all',
      ...(options || {}),
      autoRevoke,
    });
  },
};

const limuDebugSlow = {
  ...lib,
  createDraft(base, options) {
    return lib.createDraft(base, { debug: true, fastModeRange: 'none', ...(options || {}), autoRevoke });
  },
  produce(base, draftCb, options) {
    return lib.produce(base, draftCb, {
      fastModeRange: 'none',
      ...(options || {}),
      autoRevoke,
    });
  },
};

const limu = {
  ...lib,
  createDraft(base, options) {
    return lib.createDraft(base, { ...options, autoRevoke });
  },
  produce(base, draftCb, options) {
    return lib.produce(base, draftCb, { ...options, autoRevoke });
  },
};

module.exports = {
  limu,
  limuDebug,
  limuDebugSlow,
};
