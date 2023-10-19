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
- No freeze by default, faster than `immer` in different situations.
- Natural Support for map and Set.

> Pay attention, limu can only run on JavaScript runtime that supports proxy

## Performance ⚡️

No freeze by default, limu is 3 to 5 times or more faster than Immer in most scenarios

[test 1](https://github.com/tnfe/limu/blob/main/benchmark/opBigData.js) (inspired by this [immer case](https://github.com/immerjs/immer/blob/main/__performance_tests__/add-data.mjs) ) ![](https://user-images.githubusercontent.com/7334950/257369962-c0577e96-cb2c-48cb-8f65-c11979bfd506.png)

[test 2](https://github.com/tnfe/limu/blob/main/benchmark/caseReadWrite.js) ![test 2](https://user-images.githubusercontent.com/7334950/257380995-1bfc3652-1730-4ecd-ba1b-adaddd3db98d.png)

The performance testing process is as follows

```bash
git clone https://github.com/tnfe/limu
cd limu
npm i
cd benchmark
npm i
node opBigData.js // trigger test execution, the console echoes the result
# or
node caseOnlyRead.js
npm run s1
npm run s2
npm run s3
npm run s4
```

You are very welcome to submit your test to the [benchmark directory](https://github.com/tnfe/limu/tree/main/benchmark) or [test directory](https://github.com/tnfe/limu/tree/main/test)

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

## Experience limu on the console

![logo](https://raw.githubusercontent.com/fantasticsoul/assets/master/limu/limu-benchmark.jpg)

As limu is an immutable js library based on shallow copy on read and mark modified on write. Based on this mechanism, so it is more friendly to debugging. You can copy the following code to the console experience

there are 2 ways to quickly experience limu and compare limu with immer.

- 1, open [limu doc site](https://tnfe.github.io/limu/) and right-click to open the console.

- 2, visit [unpkg](https://unpkg.com/), right-click to open the console, and then paste the following code to load js

```ts
function loadJs(url) {
  const dom = document.createElement('script');
  dom.src = url;
  document.body.appendChild(dom);
}

loadJs('https://unpkg.com/limu@3.5.5/dist/limu.min.js'); // load limu umd bundle
loadJs('https://unpkg.com/immer@9.0.21/dist/immer.umd.production.min.js'); // load immer umd bundle
```

Then you can paste below codes to run

- case 1

```ts
function oneCase(produce) {
  const demo = { info: Array.from(Array(10000).keys()) };
  produce(demo, (draft) => {
    draft.info[2000] = 0;
  });
}

function runBenchmark(produce, label) {
  const start = Date.now();
  const limit = 100;
  for (let i = 0; i < limit; i++) {
    oneCase(produce);
  }
  console.log(`${label} avg spend ${(Date.now() - start) / limit} ms`);
}

function run() {
  immer.setAutoFreeze(false);
  runBenchmark(immer.produce, 'immer,');
  runBenchmark(limu.produce, 'limu,');
}
```

- case 2

```ts
lib = window.limu; // or lib = window.immer
const base = {
  a: 1,
  b: { b1: 1, b2: 2, b3: { b31: 1 } },
  c: [1, 2, 3],
  d: { d1: 1000 },
};
const draft = lib.createDraft(base);
draft.a = 200;
draft.b.b1 = 100;
console.log(draft);
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

## License

Copyright (c) Tencent Corporation. All rights reserved.

Limu is released under the MIT License(https://opensource.org/licenses/MIT)
