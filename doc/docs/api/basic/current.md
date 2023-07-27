---
sidebar_position: 5
---

import '@site/src/utils/bindLimu';

# current

获得草稿对象指定节点的数据副本，修复副本不会影响草稿数据，也不会影响原始数据

```ts
import { createDraft, current } from 'limu';

const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const draft = createDraft(base);
const listCopy = current(draft.c);

listCopy.push(4); // 得到一份独立的副本
```

:::caution

注意此函数针对草稿对象有效，如对普通对象使用，则修改也会影响普通对象

:::

```ts
const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const listCopy = current(base.c);
listCopy.push(4); // 修改会影响 base.c
```
