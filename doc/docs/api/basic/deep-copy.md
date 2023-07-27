---
sidebar_position: 6
---

import '@site/src/utils/bindLimu';

# deepCopy

克隆原始对象，得到一份全新的副本对象，对副本的修改行为将不会影响原始对象

```ts
import { deepCopy } from 'limu';

const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
const copy = deepCopy(base);

copy.a = 100; // 修改 copy 并不会影响 base
```

:::tip

深克隆性能损耗较大，大多数时候应该考虑使用`produce`和`createDraft/finishDraft`来操作副本对象，并且还能达到无变化的部分可以结构共享的效果

:::
