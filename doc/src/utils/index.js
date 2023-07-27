import * as limu from 'limu';

export function noop(...args) {
  return args;
}

export function bindLimuToGlobal() {
  globalThis.limu = limu;
  globalThis.produce = limu.produce;
  globalThis.createDraft = limu.createDraft;
  globalThis.finishDraft = limu.finishDraft;
}
