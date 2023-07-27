// module.exports = require('limu');

// make sure you've runned `npm run build` at root dir
const lib = require('../../dist/limu.js');

const limuFast = {
  ...lib,
  createDraft(base, options) {
    return lib.createDraft(base, { fastModeRange: 'all', ...(options || {}) });
  },
  produce() {
    return lib.produce(base, draftCb, {
      fastModeRange: 'all',
      ...(options || {}),
    });
  },
};

const limuSlow = {
  ...lib,
  createDraft(base, options) {
    return lib.createDraft(base, { fastModeRange: 'none', ...(options || {}) });
  },
  produce() {
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
  produce() {
    return lib.produce(base, draftCb, options);
  },
};

module.exports = {
  limu,
  limuFast,
  limuSlow,
};
