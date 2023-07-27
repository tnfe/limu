## limu 🍋

`limu` is short of **love immutable**, born for efficient creation and operation of immutable object, based on shallow copy on read and mark modified on write mechanism.

<p align="center">
  <a href="https://concentjs.github.io/concent-doc">
    <img width="260" src="https://raw.githubusercontent.com/fantasticsoul/assets/master/limu/limu.png">
  </a>
</p>

It is fast, It is nearly more than **2 or 20** times faster than `immer` in different situations. Click this [online perf demo](https://codesandbox.io/s/limu-simple-perf-case-ycky1t?file=/src/index.js) to review the amazing result.

- Debugging friendly, view draft directly anytime without `current`.
- Smaller package, only 4.3kb gzip.
- No freeze by default, At least 10 times faster than immer at this situation.
- Natural Support for map and Set.

> Pay attention, limu can only run on JavaScript runtime that supports proxy

## Quick Start

install

```bash
npm i limu
```

apis

```js
import { produce, createDraft, finishDraft } from 'limu';
```

### produce

```js
const baseState = {
  a: 1,
  b: [1, 2, 3],
  c: {
    c1: { n: 1 },
    c2: { m: 2 },
  },
};
const nextState = produce(baseState, (draft) => {
  draft.a = 2;
  draft.b['2'] = 100;
});

console.log(nextState === baseState); // false
console.log(nextState.a === baseState.a); // false
console.log(nextState.b === baseState.b); // false
console.log(nextState.c === baseState.c); // true
```

Currying call

```js
const producer = produce((draft) => {
  draft.a = 2;
  draft.b['2'] = 100;
});
const nextState = producer(baseState);
```

### createDraft, finishDraft

```js
const draft = createDraft(baseState);
draft.a = 2;
draft.b = [];
const nextState = finishDraft(draft);

console.log(nextState === baseState); // false
console.log(nextState.a === baseState.a); // false
console.log(nextState.b === baseState.b); // false
console.log(nextState.c === baseState.c); // true
```

![performance](https://raw.githubusercontent.com/fantasticsoul/assets/master/limu/limu-benchmark.jpg)

## Performance ⚡️

It is nearly more than 2 or 20 times faster than `immer` in different situations.

The performance testing process is as follows

```bash
git clone https://github.com/tnfe/limu
cd limu
npm i
cd benchmark
npm i
node caseOnlyRead.js // trigger test execution, the console echoes the result
```

Different test strategies can be adjusted by injecting `ST` value, for example `ST=1 node caseOnlyRead.js`, the default is `4` when not injected

- ST=1, means reuse base, start freezing
- ST=2, means not to reuse base, start freezing
- ST=3, means reuse base, close freeze
- ST=4, means not to reuse base, turn off freeze

Prepared 2 test cases, read-only scenario `caseOnlyRead`, and read-write scenario `caseReadWrite`

The test results are as follows

### read only

1 `ST=1 node caseOnlyRead.js`

```
loop: 200, immer avg spend 14.6 ms
loop: 200, limu avg spend 12.68 ms
loop: 200, mutative avg spend 9.215 ms
loop: 200, pstr avg spend 4 ms
loop: 200, native avg spend 0.37 ms
```

2 `ST=2 node caseOnlyRead.js`

```
loop: 200, immer avg spend 16.63 ms
loop: 200, limu avg spend 15.02 ms
loop: 200, mutative avg spend 11.685 ms
loop: 200, pstr avg spend 5.89 ms
loop: 200, native avg spend 1.345 ms
```

3 `ST=3 node caseOnlyRead.js`

```
loop: 200, immer avg spend 13.525 ms
loop: 200, limu avg spend 11.54 ms
loop: 200, mutative avg spend 9.53 ms
loop: 200, pstr avg spend 3.79 ms
loop: 200, native avg spend 0.505 ms
```

4 `ST=4 node caseOnlyRead.js`

```
loop: 200, immer avg spend 12.965 ms
loop: 200, limu avg spend 11.2 ms
loop: 200, mutative avg spend 8.98 ms
loop: 200, pstr avg spend 4.045 ms
loop: 200, native avg spend 1.065 ms
```

### read and write

1 `ST=1 node caseReadWrite.js`

```
loop: 200, immer avg spend 4.045 ms
loop: 200, limu avg spend 4.47 ms
loop: 200, mutative avg spend 2.11 ms
loop: 200, pstr avg spend 8.835 ms
loop: 200, native avg spend 0.225 ms
```

2 `ST=2 node caseReadWrite.js`

```
loop: 200, immer avg spend 8.44 ms
loop: 200, limu avg spend 5.855 ms
loop: 200, mutative avg spend 5.525 ms
loop: 200, pstr avg spend 10.18 ms
loop: 200, native avg spend 0.895 ms
```

3 `ST=3 node caseReadWrite.js`

```
loop: 200, immer avg spend 10.025 ms
loop: 200, limu avg spend 0.89 ms
loop: 200, mutative avg spend 0.705 ms
loop: 200, pstr avg spend 8.155 ms
loop: 200, native avg spend 0.155 ms
```

4 `ST=4 node caseReadWrite.js`

```
loop: 200, immer avg spend 11.025 ms
loop: 200, limu avg spend 1.61 ms
loop: 200, mutative avg spend 1.345 ms
loop: 200, pstr avg spend 9.225 ms
loop: 200, native avg spend 0.915 ms
```

As limu is an immutable js library based on shallow copy on read and mark modified on write. Based on this mechanism, so it is more friendly to debugging. You can copy the following code to the console experience

For example, first visit [unpkg](https://unpkg.com/), right-click to open the console, and then paste the following code to load js

```ts
function loadJs(url) {
  const dom = document.createElement('script');
  dom.src = url;
  document.body.appendChild(dom);
}

loadJs('https://unpkg.com/limu@3.2.2/dist/limu.min.js');
// loadJs('https://unpkg.com/immer@9.0.21/dist/immer.umd.production.min.js');
```

Then run the test code

```ts
lib = window.LimuApi;
const base = {
  a: 1,
  b: { b1: 1, b2: 2, b3: { b31: 1 } },
  c: [1, 2, 3],
  d: { d1: 1000 },
};
const draft = lib.createDraft(base);
draft.a = 200;
draft.b.b1 = 100;
draft.c.push(4);
const final = lib.finishDraft(draft);
console.log(base === final); // false
console.log(base.a === final.a); // false
console.log(base.b === final.b); // false
console.log(base.b.b3 === final.b.b3); // true
console.log(base.c === final.c); // false
console.log(base.d === final.d); //true
```

Higher observability will greatly improve the development and debugging experience, as shown in the figure below, after unfolding the `limu` draft, you can observe all data nodes of the draft in real time

<img width="574" alt="image" src="https://github.com/unadlib/mutative/assets/7334950/2f90b07d-e2e3-4104-916c-8c0add935b41">

And the immer or mutative expansion is like this <img width="618" alt="image" src="https://github.com/unadlib/mutative/assets/7334950/44500c66-d691-4d29-b856-fa490d2bdf8f">

My conclusion is that the pursuit of extreme performance `mutative` is indeed better, and the pursuit of debugging-friendly `limu` is better. In any case, in the case of freezing, both of them are several times higher than `immer`, and respect `mutative`'s immutable Exploration ∠(° ゝ °) ❤️

### Submit your test

You are very welcome to submit your test to the benchmark directory

## License

Copyright (c) Tencent Corporation. All rights reserved.

Limu is released under the MIT License(https://opensource.org/licenses/MIT)
