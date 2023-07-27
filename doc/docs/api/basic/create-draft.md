---
sidebar_position: 2
---

import '@site/src/utils/bindLimu';

# createDraft/finishDraft

提供和`produce`是一样的，唯一的区别是支持异步的结束草稿，而`produce`同步的，所以它们的具体使用方式可参加[produce](/docs/api/basic/produce)使用说明

`createDraft`负责创建草稿、`finishDraft`负责结束草稿，以下写法是将`produce`转为等效的`createDraft/finishDraft`表达方式

```ts
import { produce, createDraft, finishDraft } from 'limu';

const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const next = produce(base, (draft) => {
  draft.c.push(4);
});

// 等效于
const draft = createDraft(base);
draft.c.push(4);
const next = finishDraft(draft);
```

### 异步地结束草稿

```ts
async function demo() {
  const draft = createDraft(base);
  await doSomeStaff();
  draft.c.push(4);
  const next = finishDraft(draft);
}
```
