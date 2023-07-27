---
sidebar_position: 7
---

import '@site/src/utils/bindLimu';

# deepFreeze

冻结原始对象，让原始对象不可修改

```ts
import { deepFreeze } from 'limu';

const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
deepFreeze(base);

base.a = 100; // 修改无效
```

:::tip

深度冻结性能损耗较大，如是不暴露原始对象出去，只暴露生成的不可变对象出去的场景，可采用拥有读时浅代理机制的[immut](/docs/api/basic/immut)替代

:::
