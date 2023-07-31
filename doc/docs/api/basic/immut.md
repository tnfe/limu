---
sidebar_position: 3
---

import '@site/src/utils/bindLimu';

# immut

生成一个不可修改的对象`im`，但原始对象的修改将同步会影响到`im`

```ts
import { immut } from 'limu';

const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const im = immut(base);

im.a = 100; // 修改无效
base.a = 100; // 修改会影响 im
```

合并后可以读到最新值

```ts
const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const im = immut(base);
const draft = createDraft(base);
draft.d.d1 = 100;

console.log(im.d.d1); // 1，保持不变
const next = finishDraft(draft);
Object.assign(base, next);
console.log(im.d.d1); // 100，im和base始终保持数据同步
```

:::tip

immut 采用了读时浅代理的机制，相比[deepFreeze](/docs/api/basic/deep-freeze)会拥有更好性能，适用于不暴露原始对象出去，只暴露生成的不可变对象出去的场景（ 利用[onOperate](/docs/api/basic/produce)收集读依赖 ）

:::
