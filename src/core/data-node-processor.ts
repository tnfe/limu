import { isPrimitive, canHaveProto, canBeNum, isSymbol } from '../support/util';
import { ver2MetasList } from '../support/inner-data';
import { metasKey } from '../support/symbols';
import { carefulType2FnKeys, arrIgnoreFnOrAttributeKeys } from '../support/consts';
import {
  getMeta,
  getUnProxyValue,
  getKeyPath,
  makeCopy,
  getRealProto,
  setMetasProto,
} from './helper';

// slice、concat 以及一些特殊的key取值等操作无需copy副本
function allowCopyForOp(parentType, op) {
  const isArray = parentType === 'Array';
  if (isArray && arrIgnoreFnOrAttributeKeys.includes(op)) {
    return false;
  }
  // like Symbol(Symbol.isConcatSpreadable) in test case array-base/concat
  if (isSymbol(op)) {
    return false;
  }
  if (isArray && canBeNum(op)) {
    return false;
  }
  return true;
}

export function copyDataNode(dataNode, copyCtx, isFirstCall) {
  const { op, key, value: mayProxyValue, metaVer, parentType } = copyCtx;
  const dataNodeMeta = getMeta(dataNode, metaVer);
  /**
   * 防止 value 本身就是一个 Proxy
   * var draft_a1_b = draft.a1.b;
   * draft.a2 = draft_a1_b;
   */
  let value = mayProxyValue;
  if (isFirstCall) {
    // value 本身可能是代理对象
    value = getUnProxyValue(mayProxyValue, metaVer);
  }

  if (dataNodeMeta) {
    let selfCopy = dataNodeMeta.copy;
    const allowCopy = allowCopyForOp(parentType, op);
    // try {
    //   console.log(`allowCopy ${allowCopy} op ${op}`);
    // } catch (err) {
    //   console.log(`allowCopy ${allowCopy} op symbol`);
    //   console.log(op);
    // }
    if (!selfCopy && allowCopy) {
      selfCopy = makeCopy(dataNodeMeta);
      dataNodeMeta.copy = selfCopy;

      if (!isPrimitive(value)) {
        const valueMeta = getMeta(value, metaVer);
        if (true) {
          if (valueMeta) {
            /**
             * 值的父亲节点和当时欲写值的数据节点层级对不上，说明节点发生了层级移动
             * 总是记录最新的父节点关系，防止原有的关系被解除
             * ------------------------------------------------------------
             * 
             * // 移动情况
             * // draft is { a: { b: { c: { d: { e: 1 } } } } }
             * const dValue = draft.a.b.c.d; // { e: 1 }
             * const cValue = draft.a.b.c; // cValue: { d: { e: 1 } }，此时 cValue 已被代理，parentLevel = 2
             * 
             * // [1]: dataNode: draft, key: 'a', value: cValue
             * draft.a = cValue; 
             * // parentLevel = 0, 数据节点层级出现移动
             * 
             * // [2]: dataNode: draft.a, key: 'b', value: cValue
             * draft.a.b = cValue; 
             * // parentLevel = 1, 数据节点层级出现移动
             *
             * // [3]: dataNode: draft.a.b, key: 'c', value: cValue
             * draft.a.b.c = cValue; 
             * // parentLevel = 2, 数据节点层级没有出现移动，还保持原来的关系
             *
             * ------------------------------------------------------------
             * // 关系解除情况
             * // draft is { a: { b: { c: { d: { e: 1 } } } }, a1: 2 }
             * const d = draft.a.b.c.d;
             * draft.a1 = d;
             * draft.a.b.c = null; // d属性数据节点和父亲关系解除
             */
            if (valueMeta.parent.level !== dataNodeMeta.level) {
              // 修正 valueMeta 维护的相关数据
              valueMeta.parent = dataNodeMeta.self;
              valueMeta.level = dataNodeMeta.level + 1;
              valueMeta.key = key;
              valueMeta.keyPath = getKeyPath(valueMeta.parent, key, metaVer);

              /**
               * 父亲节点 P 和当时欲写值的数据节点 C 层级相等，也不能保证 C 向上链路的所有父辈们是否有过层级移动
               * 因为他们发生移动时，是不会去修改所有子孙的元数据的
               */
            } else {
              // thinking
            }

            /**
             * 还没为当前数据节点建立代理，就被替换了
             * // draft is { a: { b: { c: 1 } } }
             * draft.a = { b: { c: 100 } };
             */
          } else {
            // do nothing，会在将来 get 时触发代理对象创建
          }
        }
      }

      // 向上回溯，复制完整条链路，parentMeta 为 null 表示已回溯到顶层
      if (dataNodeMeta.parentMeta) {
        const copyCtx = { key: dataNodeMeta.key, value: selfCopy, metaVer };
        copyDataNode(dataNodeMeta.parentMeta.self, copyCtx, false,);
      }
    }


    if (!allowCopy) {
      if (selfCopy) return selfCopy[op];
      return dataNodeMeta.self[op];
    }

    // 是 Map, Set, Array 类型的方法操作或者值获取
    const fnKeys = carefulType2FnKeys[parentType];
    if (fnKeys) {
      if (fnKeys.includes(op)) {
        // slice 操作无需使用copy，返回自身即可
        if ('slice' === op) return dataNodeMeta.self.slice;
        return selfCopy[op].bind(selfCopy);
      }
      return selfCopy[op];
    }

    if (op === 'del') {
      delete selfCopy[key];
    } else {
      selfCopy[key] = value;
    }

    /**
     * 链路断裂，此对象未被代理
     * // draft = { a: { b: { c: 1 } }};
     * const newData = { n1: { n2: 2 } };
     * draft.a = newData;
     * draft.a.n1.n2 = 888; // 此时 n2_DataNode 是未代理对象
     */
  } else {
    dataNode[key] = value;
  }
}


export function clearAllDataNodeMeta(metaVer) {
  var metasList = ver2MetasList[metaVer];
  metasList.forEach(metas => delete metas[metaVer])
}


export function ensureDataNodeMetasProtoLayer(val, metaVer, throwError = false) {
  const canValHaveProto = canHaveProto(val);
  if (canValHaveProto) {
    let metas = val[metasKey];
    if (!metas) {
      setMetasProto(val, getRealProto(val));
      metas = val[metasKey];
    }

    // 记录 metas map
    let metasList = ver2MetasList[metaVer];
    if (!metasList) metasList = ver2MetasList[metaVer] = [];
    metasList.push(metas);
    return;
  }
  if (throwError) throw new Error('type can only be object(except null) or array');
}
