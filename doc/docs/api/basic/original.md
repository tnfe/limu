---
sidebar_position: 4
---

import '@site/src/utils/bindLimu';

# original

获得草稿对象指定节点的原始数据

```ts
import { createDraft, original } from 'limu';

const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const draft = createDraft(base);
const oriList = original(draft.c);
// 或
const oriList = original(draft).c;
```

在遍历大数组且只修改部分子元素的数据场景时，用`original`可提高遍历速度

```ts
// faster
original(draft.c).forEach((item, idx) => {
  if (item.id === 'xxx') {
    draft.c[idx].name = 'newName';
  }
});

// slow
draft.c.forEach((item, idx) => {
  if (item.id === 'xxx') {
    draft.c[idx].name = 'newName';
  }
});
```

:::tip

因为`forEach`会触发将所有子元素生成代理对象的操作，所以使用`original`包裹后会更快

:::
