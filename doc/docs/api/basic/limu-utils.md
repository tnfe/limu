---
sidebar_position: 8
---

import '@site/src/utils/bindLimu';

# limuUtils
可从`limuUtils`里调用内置的常用工具函数

```ts
import { limuUtils } from 'limu';

// const { isDraft, shallowCompare, ... } = limuUtils;

```

## isDraft

判断一个对象是否是草稿对象

```ts
const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
isDraft(base); // false

const draft = createDraft(base);
isDraft(draft); // true
```

判断一个对象是否是草稿对象

```ts
const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };
isDraft(base); // false

const draft = createDraft(base);
isDraft(draft); // true
```

## isDiff

判断任意两个值是否相等，主要解决代理后的对象判断问题

判断其他普通值
```ts
ifDiff(1,0); // true
ifDiff(1,1); // false

ifDiff({a:1},{a:1}); // true
const obj = {a:1};
ifDiff(obj,obj); // false
```

判断代理对象
```ts
ifDiff(1,1); // false
ifDiff(1,0); // true

const base = createDraft({a:{b:1}});
// 创建两个base的只读代理对象
const im1 = immut(base);
const im2 = immut(base);

// 返回 true，表示不等
// im1.a 返回的是代理对象，判断的是代理对象本身的话，它们的不等的
im1.a !== im2.a;

// 返回 false，表示相等
// 因它们代理指向的是同一个原始对象，limu 认为是相等的
ifDiff(im1.a, im2.a);
```

## shallowCompare

浅比较两个对象，相等返回true，反正返回false，除了可以比较普通对象，还专用于比较包含有第一层子节点包含有limu代理对象的对象，适用于一些基于limu封装的状态库（例如[helux](https://github.com/heluxjs/helux)）返回的状态透传给Memo组件需要执行浅比较的场景

此处我们先列举一个常用的浅比较实现`normalShallowCompare`，然后来对比`shallowCompare`两者之间的区别
```ts
/**
 * https://github.com/developit/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349
 */
function normalShallowCompare(a, b) {
  const isDiff = () => {
    for (let i in a) if (!(i in b)) return true;
    for (let i in b) if (a[i] !== b[i]) return true;
    return false;
  };
  return !isDiff(a, b);
}
```

比较普通对象时两者表现一致

```ts
const b = { b1: 1 };
const props1 = { a: 1, b };
const props2 = { a: 1, b };
normalShallowCompare(props1, props2); // true
shallowCompare(props1, props2); // true

const props3 = { a: 1, b: { b1: 1 } };
const props4 = { a: 1, b: { b1: 1 } };
normalShallowCompare(props3, props4); // false
shallowCompare(props3, props4); // false
```

比较包含有limu代理对象时

```ts
const { shallowCompare } = limuUtils;
const base = { a: [1, 2, 3], b: { b1: 1, b2: 2, c: { c1: 1, c2: 2 } } };
const im1 = immut(base);
const im2 = immut(base);
const draft = createDraft(base);
draft.a.push(4);
finishDraft(draft);

normalShallowCompare(im1.b, im2.b); // false
shallowCompare(im1.b, im2.b); // true

const props3 = { a: 1, b: im1.b };
const props4 = { a: 1, b: im2.b };
normalShallowCompare(props3, props4); // false
shallowCompare(props3, props4); // true，因为 props3.b 和 props4.b 指向的同一个原始对象
```

`shallowCompare`内部默认遇到limu代理对象时，是去比较代理原始对象，可设定第三位参数为false关闭此功能

```ts
shallowCompare(obj1, obj2, false);
// 效果和 normalShallowCompare 一致
normalShallowCompare(obj1, obj2);
```

:::tip

此函数基于 `ifDiff` 做二次封装

:::

## isFn

判断传入的值是否是函数

```ts
isFn(()=>1); // true
isFn(()=>Promise.resolve(1)); // true
isFn(async function(){}); // true
isFn(function(){}); // true
isFn(1); // false
```

## isMap

判断传入的值是否是`Map`

```ts
isFn(new Map()); // true
```

## isSet

判断传入的值是否是`Set`

```ts
isFn(new Set()); // true
```

## isObject

判断传入的值是否是简单json对象

```ts
isObject({}); // true
isObject({a:1}); // true
isObject([]); // false
isObject(null); // false
isObject(undefined); // false
```

## isPrimitive

判断传入的值是否是原始值，非`Function`，`Object`，`Map`，`Set`，`Array`的都当做原始值

```ts
isPrimitive(1); // true
isPrimitive(true); // true
isPrimitive(null); // true
isPrimitive(undefined); // true
isPrimitive('s'); // true
```

:::tip

如需对`symbol`判断，可使用下面的`isSymbol`函数

:::

## isSymbol

判断传入的值是否是symbol值

```ts
isSymbol(Symbol(1)); // true
```

## getDraftMeta

获取limu代理对象（草稿对象）对应的元数据

```ts
const base = { a: [1, 2, 3], b: { b1: 1, b2: 2, c: { c1: 1, c2: 2 } } };
const im = immut(base);
const draft = createDraft(base);

getDraftMeta(im);
getDraftMeta(draft);
```
