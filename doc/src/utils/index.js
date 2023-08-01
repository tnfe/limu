import * as immer from 'immer';
import * as limu from 'limu';

export function noop(...args) {
  return args;
}

export function bindLimuToGlobal() {
  globalThis.immer = immer;
  globalThis.limu = limu;
  globalThis.produce = limu.produce;
  globalThis.createDraft = limu.createDraft;
  globalThis.finishDraft = limu.finishDraft;
}
