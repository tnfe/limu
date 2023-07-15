/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 * 
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { ObjectLike } from '../inner-types';
import { isMap, isSet, noop, isPrimitive } from '../support/util';


export function deepFreeze<T extends ObjectLike>(obj: T) {
  if (isPrimitive(obj)) {
    return obj;
  }

  // @ts-ignore
  if (Array.isArray(obj) && obj.length > 0) {
    obj.forEach(item => {
      deepFreeze(item);
    });
    return Object.freeze(obj);
  }

  if (isSet(obj)) {
    const set = obj as Set<any>;
    // TODD: throw error 'do not mutate' ?
    set.add = () => set;
    set.delete = () => false;
    set.clear = noop;
    return Object.freeze(obj);
  }
  if (isMap(obj)) {
    const map = obj as Map<any, any>;
    // TODD: throw error 'do not mutate' ?
    map.set = () => map;
    map.delete = () => false;
    map.clear = noop;
    return Object.freeze(obj);
  }

  // get all properties
  const propertyNames = Object.getOwnPropertyNames(obj);
  propertyNames.forEach(name => {
    const value = obj[name];
    if (value instanceof Object && value !== null) {
      deepFreeze(value);
    }
  })
  return Object.freeze(obj);
}
