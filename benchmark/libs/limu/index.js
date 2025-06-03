// const lib = require('limu');
// make sure you've runned command `npm run build` at project root dir
const lib = require('../../../dist/limu.js');
console.log('read dist limu');
// const lib = require('./limu-3.13.0.js'); console.log('read current dif limu-3.13.0');

console.log('process.env.DISABLE_REVOKE', process.env.DISABLE_REVOKE);
console.log('process.env.ST', process.env.ST);
const autoRevoke = process.env.DISABLE_REVOKE === '1' ? false : true;

const limuFast = {
  ...lib,
  createDraft(base, options) {
    return lib.createDraft(base, { fast: true, ...(options || {}), autoRevoke });
  },
  produce(base, draftCb, options) {
    return lib.produce(base, draftCb, { fast: true, ...(options || {}), autoRevoke });
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
  limuFast,
};
