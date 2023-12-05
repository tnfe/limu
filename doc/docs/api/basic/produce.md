---
sidebar_position: 1
---

import '@site/src/utils/bindLimu';

# produce

不影响基础数据，同步生成下一份数据的接口

也可以使用具名导出

```ts
import { produce } from 'limu';
```

:::tip

以下所有代码示例可复制到浏览器控制台直接运行

:::

### 生成草稿并修改

`limu`原始支持对`Object`、`Array`、`Map`、`Set`四种数据作为根对象来生成草稿对象，并对其草稿可使用像原生 js 一样的所有方式做修改。

代码格式

```ts
import { produce } from 'limu';

const nextState = produce(baseState, (draft) => {
  /** 在此回调里做同步的草稿修改 */
});
```

一些简单示例：

- Object

```ts
const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const next = produce(base, (draft) => {
  draft.c.push(4);
});
```

- Array

```ts
const base = [{ a: 1 }, { a: 2 }, { a: 3 }];
const next = produce(base, (draft) => {
  draft.push({ a: 4 });
  draft[0].a = 100;
});
```

- Map

```ts
const base = new Map([
  ['nick', { list: [1, 2, 3], info: { age: 1, grade: 4, money: 1000 } }],
  ['fancy', { list: [1, 2, 3, 4, 5], info: { age: 2, grade: 6, money: 100000000 } }],
  ['anonymous', { list: [1, 2], info: { age: 0, grade: 0, money: 0 } }],
]);
const next = produce(base, (draft) => {
  draft.delete('anonymous');
  draft.get('fancy').info.money = 200000000;
});
```

- Set

```ts
const base = new Set([1, 2, 3]);
const next = produce(base, (draft) => {
  draft.add(4);
});
```

### 冻结草稿结案生成的新对象

设置`autoFreeze`为 true，`produce`返回的新对象（由草稿结案生成）将被冻结

```ts
const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const next = produce(
  base,
  (draft) => {
    draft.c.push(4);
  },
  { autoFreeze: true },
);
next.a = 100;
console.log(next.a); // 1
```

:::caution

limu 默认`autoFreeze`是 false，不冻结新对象，请谨慎设置此属性，将会造成额外的性能损耗

:::

### 监听读写过程

配置`onOperate`回调，监听到草稿对象的整个读写过程，此功能可用于辅助一些上层库（如[helux](http://github.com/heluxjs/helux)）收集相关读写依赖

```ts
const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const next = produce(
  base,
  (draft) => {
    draft.c.push(4);
    draft.a = 100;
    delete draft.d.d1;
  },
  { onOperate: console.log },
);
```

将生成以下日志

```ts
{"parentType":"Object","op":"get","isBuiltInFnKey":false,"isChanged":false,"key":"c","keyPath":[],"fullKeyPath":["c"],"value":[1,2,3]}
{"parentType":"Array","op":"get","isBuiltInFnKey":true,"isChanged":true,"key":"push","keyPath":["c"],"fullKeyPath":["c","push"]}
{"parentType":"Array","op":"set","isBuiltInFnKey":false,"isChanged":true,"key":"3","keyPath":["c"],"fullKeyPath":["c","3"],"value":4}
{"parentType":"Array","op":"set","isBuiltInFnKey":false,"isChanged":true,"key":"length","keyPath":["c"],"fullKeyPath":["c","length"],"value":4}
{"parentType":"Object","op":"set","isBuiltInFnKey":false,"isChanged":true,"key":"a","keyPath":[],"fullKeyPath":["a"],"value":100}
{"parentType":"Object","op":"get","isBuiltInFnKey":false,"isChanged":false,"key":"d","keyPath":[],"fullKeyPath":["d"],"value":{"d1":1,"d2":2}}
{"parentType":"Object","op":"del","isBuiltInFnKey":false,"isChanged":true,"key":"d1","keyPath":["d"],"fullKeyPath":["d","d1"],"value":1}
```

`onOperate`的回调参数`IOperateParams`解释

```ts
interface IOperateParams {
  /** 当前操作节点所属父节点的数据类型 */
  parentType: 'Map' | 'Set' | 'Array' | 'Object';
  /** 当前操作节点的操作key */
  key: string;
  /** 当前操作节点所属父节点的路径 */
  keyPath: string[];
  /** 当前操作节点路径 */
  fullKeyPath: string[];
  /** 当前key是否是内置函数，针对 'Map' 'Set' 'Array' 的操作时会可能为true，例如 forEach */
  isBuiltInFnKey: boolean;
  /** 当前操作是否将引起数据改变，如 Array.map 不会，Array.push 则会 */
  isChanged: boolean;
  /** 操作类型 */
  op: 'del' | 'set' | 'get';
  /** 对应的操作值 */
  value: any;
}
```

### 设置草稿为只读

配置`readOnly`为 true，草稿将变成一个只可读对象

```ts
const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const next = produce(
  base,
  (draft) => {
    draft.c.push(4);
    draft.c.push(4);
    console.log(draft.c.length); // 3
  },
  { readOnly: true },
);
```
