# Change Log

[released] - 2024-01-05

## [3.12.0](xx) (2023-12-24)

* **设定对象不转为代理** 新增`markRaw`函数，用于标记不需要被代理的对象节点

> 需注意通过 markRaw 标记后的对象，会失去结构共享特性

```ts
import { markRaw, createDraft, finishDraft } from 'limu';

const base = { a: { key: null as any } };

const draft = createDraft(base);
draft.a.key = markRaw({ sub: 1 });
const node1 = draft.a.key; // 新增对象不被转为代理
expect(limuUtils.isMardedRaw(node1)).toBeTruthy();
const next = finishDraft(draft);

const draft2 = createDraft(next);
const node2 = draft2.a.key; // 再次读取时，因被 markRaw 标记， node 节点不会被转为代理
expect(limuUtils.isMardedRaw(node2)).toBeTruthy();
node2.sub = 100;
const next2 = finishDraft(draft2);

// 由于 markRaw 标记导致对象失去结构共享特性，node 节点在所有快照里指向同一个引用，
// 故修改值后会影响所有快照里的被 markRaw 标记的节点
expect(next.a.key.sub === 100).toBeTruthy();
expect(next2.a.key.sub === 100).toBeTruthy();
```

可通过`limuUtils.isMarkedRaw` 判断节点是否已被 `markRaw`标记