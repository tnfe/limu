/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { FastModeRange } from '../inner-types';

export const verWrap = { value: 0, usablePrefix: 1 };

interface IConf {
  autoFreeze: boolean;
  autoRevoke: boolean;
  fastModeRange: FastModeRange;
}

export const conf: IConf = {
  autoFreeze: false,
  autoRevoke: true,
  fastModeRange: 'array',
};
