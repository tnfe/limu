/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Tencent Corporation. All rights reserved.
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/

// 用于验证 proxyDraft 和 finishDraft函数 是否能够匹配
export const verKey = Symbol('verKey');

export const metasKey = Symbol('metas');

export const finishHandler = Symbol('finishHandler');

export const isModifiedKey = Symbol('isModifiedKey');
