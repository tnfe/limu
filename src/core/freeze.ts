/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { ObjectLike } from '../inner-types';
import { isMap, isPrimitive, isSet, noop } from '../support/util';

export function deepFreeze<T extends ObjectLike>(obj: T) {
  if (isPrimitive(obj)) {
    return obj;
  }

  // @ts-ignore
  if (Array.isArray(obj) && obj.length > 0) {
    obj.forEach(deepFreeze);
    return Object.freeze(obj);
  }

  if (isSet(obj)) {
    const set = obj as Set<any>;
    // TODO: throw error 'do not mutate' ?
    set.add = () => set;
    set.delete = () => false;
    set.clear = noop;
    // @ts-ignore
    for (const item of set.values()) {
      Object.freeze(item);
    }
    return Object.freeze(obj);
  }

  if (isMap(obj)) {
    const map = obj as Map<any, any>;
    // TODO: throw error 'do not mutate' ?
    map.set = () => map;
    map.delete = () => false;
    map.clear = noop;
    // @ts-ignore
    for (const item of map.values()) {
      Object.freeze(item);
    }
    return Object.freeze(obj);
  }

  // get all properties
  const propertyNames = Object.getOwnPropertyNames(obj);
  propertyNames.forEach((name) => {
    // @ts-ignore
    const value = obj[name];
    deepFreeze(value);
  });

  return Object.freeze(obj);
}
