// module.exports = require('limu');

// make sure you've runned command `npm run build` at project root dir
const lib = require('../../dist/limu.js');

const limuDebug = {
  ...lib,
  createDraft(base, options) {
    return lib.createDraft(base, { debug:true, fastModeRange: 'all', ...(options || {}) });
  },
  produce(base, draftCb, options) {
    return lib.produce(base, draftCb, {
      fastModeRange: 'all',
      ...(options || {}),
    });
  },
};

const limuDebugSlow = {
  ...lib,
  createDraft(base, options) {
    return lib.createDraft(base, { debug:true, fastModeRange: 'none', ...(options || {}) });
  },
  produce(base, draftCb, options) {
    return lib.produce(base, draftCb, {
      fastModeRange: 'none',
      ...(options || {}),
    });
  },
};

const limu = {
  ...lib,
  createDraft(base, options) {
    return lib.createDraft(base, options);
    // return lib.immut(base);
  },
  produce(base, draftCb, options) {
    return lib.produce(base, draftCb, options);
  },
};

module.exports = {
  limu,
  limuDebug,
  limuDebugSlow,
};
