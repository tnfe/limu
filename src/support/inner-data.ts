/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/

export interface IIdWrap {
  value: number;
  prefixSeed: number;
}

function getId(idWrap: IIdWrap, customPrefix = '') {
  if (idWrap.value >= Number.MAX_SAFE_INTEGER) {
    idWrap.value = 1;
    idWrap.prefixSeed += 1;
  } else {
    idWrap.value += 1;
  }

  const { value, prefixSeed } = idWrap;
  const metaVer = `${customPrefix}${prefixSeed}_${value}`;
  return metaVer;
}

export const verWrap: IIdWrap = { value: 0, prefixSeed: 1 };

export const idWrap: IIdWrap = { value: 0, prefixSeed: 1 };

export const symbolIdWrap: IIdWrap = { value: 0, prefixSeed: 1 };

export const symbolStrDict: Record<any, string> = {};

export function genMetaId() {
  return getId(idWrap, 'MID_');
}

export function genMetaVer() {
  return getId(verWrap, 'MV_');
}

export function genSymbolId() {
  return getId(symbolIdWrap, 'SI_');
}

interface IConf {
  autoFreeze: boolean;
  autoRevoke: boolean;
}

export const conf: IConf = {
  autoFreeze: false,
  autoRevoke: true,
};
