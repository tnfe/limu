---
sidebar_position: 1
---

# produce

不影响基础数据，同步生成下一份数据的接口

`limu`默认导出 produce
```ts
import produce from 'limu';
```

也可以使用具名导出
```ts
import { produce } from 'limu';
```

### 修改草稿数据
```ts
import { produce } from 'limu';

const base = { a: 1, b: 2, c: [1,2,3], d: {d1: 1, d2: 2} };
const next = produce(base, draft=>{
  draft.c.push(4);
});



```
