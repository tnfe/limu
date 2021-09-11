const limu = require('../dist/limu');

// const limu = require('immer');
// limu.enableMapSet();

exports.createDraft = limu.createDraft;

exports.finishDraft = limu.finishDraft;

exports.produce = limu.produce;
