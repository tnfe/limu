---
sidebar_position: 9
---

import '@site/src/utils/bindLimu';

# setAutoFreeze

设置全局配置`是否冻结结束的草稿对象`，limu 默认`autoFreeze`为 false

```ts
import { createDraft, finishDraft, setAutoFreeze } from 'limu';

setAutoFreeze(true);

const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const draft = createDraft(base);
draft.c.push(4);
const next = finishDraft(draft);
next.c.push(5); // 不可再修改
```

设置后如需某个草稿的结果可修改，可独立开启

```ts
const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const draft = createDraft(base, { autoFreeze: false });
```

:::caution

limu 默认`autoFreeze`是 false，不冻结新对象，请谨慎设置此属性，将会造成额外的性能损耗

:::
