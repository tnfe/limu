/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { FastModeRange } from '../inner-types';

export const verWrap = { value: 0, usablePrefix: 1 };

interface IConf {
  autoFreeze: boolean;
  usePatches: boolean;
  fastModeRange: FastModeRange;
}

export const conf: IConf = {
  autoFreeze: false,
  /**
   * to be implemented in the future
   */
  usePatches: false,
  fastModeRange: 'array',
};
