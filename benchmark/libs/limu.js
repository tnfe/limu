const lib = require('limu');
// make sure you've runned command `npm run build` at project root dir
// const lib = require('../../dist/limu.js');
// console.log('read dist limu');

// 3.12.0 npm run s1
// 3.12 版本可能存在内存泄露
// After 5000 ms: heapTotal 40.08 MB heapUsed 5.48 MB rss 79.16 MB external 0.33 MB
// After 10000 ms: heapTotal 40.08 MB heapUsed 5.50 MB rss 79.16 MB external 0.33 MB
// After 15000 ms: heapTotal 40.08 MB heapUsed 5.50 MB rss 79.16 MB external 0.33 MB
// After 20000 ms: heapTotal 40.08 MB heapUsed 5.51 MB rss 79.16 MB external 0.33 MB
// After 25000 ms: heapTotal 40.08 MB heapUsed 5.52 MB rss 79.16 MB external 0.33 MB
// After 30000 ms: heapTotal 40.08 MB heapUsed 5.53 MB rss 79.16 MB external 0.33 MB

// 3.13.0 npm run s1
// After 5000 ms: heapTotal 40.58 MB heapUsed 5.57 MB rss 80.67 MB external 0.33 MB
// After 10000 ms: heapTotal 7.33 MB heapUsed 5.26 MB rss 46.48 MB external 0.32 MB
// After 15000 ms: heapTotal 7.33 MB heapUsed 5.45 MB rss 46.48 MB external 0.32 MB
// After 20000 ms: heapTotal 7.33 MB heapUsed 5.46 MB rss 46.48 MB external 0.32 MB
// After 25000 ms: heapTotal 7.33 MB heapUsed 5.48 MB rss 46.50 MB external 0.32 MB
// After 30000 ms: heapTotal 7.33 MB heapUsed 5.48 MB rss 46.50 MB external 0.32 MB

const limuDebug = {
  ...lib,
  createDraft(base, options) {
    return lib.createDraft(base, { debug: true, fastModeRange: 'all', ...(options || {}) });
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
    return lib.createDraft(base, { debug: true, fastModeRange: 'none', ...(options || {}) });
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
