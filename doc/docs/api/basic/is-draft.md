---
sidebar_position: 8
---

import '@site/src/utils/bindLimu';

# isDraft

判断一个对象是否是草稿对象

```ts
import { createDraft, isDraft } from 'limu';

const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
isDraft(base); // false

const draft = createDraft(base);
isDraft(draft); // true
```
