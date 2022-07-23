## limu 🍋
`limu` is short of **love immutable**, born for efficient creation and operation of immutable object, 


<p align="center">
  <a href="https://concentjs.github.io/concent-doc">
    <img width="260" src="https://raw.githubusercontent.com/fantasticsoul/assets/master/limu/limu.png">
  </a>
</p>

It is fast, It is nearly more than **2 or 20** times faster than `immer` in different situations.
Click this [online perf demo](https://codesandbox.io/s/limu-simple-perf-case-ycky1t?file=/src/index.js) to review the amazing result.


See more perf test result
```
1. git clone git@github.com:tnfe/limu.git
2. cd benchmark
3. npm i
4. node ./limu-vs-immer.js
```

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
  b: [ 1, 2, 3 ],
  c: {
    c1: { n: 1 },
    c2: { m: 2 },
  }
};
const nextState = produce(baseState, (draft)=>{
  draft.a = 2;
  draft.b['2'] = 100;
});

console.log(nextState === baseState); // false
console.log(nextState.a === baseState.a); // false
console.log(nextState.b === baseState.b); // false
console.log(nextState.c === baseState.c); // true
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


### Simple Demo
Execute `cd benchmark` and `node ./readme-demo.js` bash command.

Run [Code](https://github.com/tnfe/limu/blob/main/benchmark/case1.js) below:
```js
const immer = require('immer');
const limu = require('limu');

immer.setAutoFreeze(false);
limu.setAutoFreeze(false);

function getBase() {
  const base = {
    a: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a1: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a2: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a3: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a4: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a5: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a6: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a7: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a8: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a9: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a10: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a11: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    a12: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: { m: { n: 1 } } } } } } } } } } } } },
    arr: [1, 2, 3],
    b: null,
  };
  return base;
};

function die(label) {
  throw new Error(label);
};

function oneBenchmark(lib, base) {
  const start = Date.now();
  const draft = lib.createDraft(base);
  draft.a.b.c.d.e.f.g = 999;
  draft.arr[1] = 100;
  const final = lib.finishDraft(draft);
  if (final === base) {
    die('should not be equal');
  }
  if (final.arr[1] !== 100) {
    die('final.arr[1] !== 100');
  }
  if (base.arr[1] !== 2) {
    die('base.arr[1] !== 1');
  }

  const draft2 = lib.createDraft(base);
  delete draft2.b;
  const final2 = lib.finishDraft(draft2);
  if (final2 === base) {
    die('should not be equal');
  }
  if (base.b !== null) {
    die('base.b should be null');
  }

  const taskSpend = Date.now() - start;
  return taskSpend;
}


function measureBenchmark(label, loopLimit) {
  const immutLibs = { limu, immer };
  const lib = immutLibs[label];

  console.log(` ------------- ${label} benchmark ------------- `);
  const base = getBase();
  let totalSpend = 0;
  for (let i = 0; i < loopLimit; i++) {
    totalSpend += oneBenchmark(lib, base);
  }
  console.log(`${label} avg spend ${totalSpend / loopLimit} ms \n`);
}

measureBenchmark('limu', 10000);
measureBenchmark('immer', 10000);
```

at `MacBook 2021 m1 max`, the perf result is:
```bash
 ------------- limu benchmark ------------- 
limu avg spend 0.0066 ms 

 ------------- immer benchmark ------------- 
immer avg spend 0.0446 ms 
```
as you see limu is almost seven times faster than immer at the case mentioned above.

### Complex Demo
Follow the steps below to heck more complex perf test
```
1. cd benchmark
2. npm i
3. node ./limu-vs-immer.js
```

You can change the params to test perf of different situations
```ts
// ************************************************************************
const curStrategy = process.env.ST || strategyConsts.BASE_F_AUTO_F;
// change params 'hasArr'、'lessDeepOp' to test limu and immer performance in different situations
// then run npm cmd: `npm run s1`、`npm run s2`、`npm run s3`、`npm run s4` to see perf result
const hasArr = false; // operate arr or not
const lessDeepOp = true; // has more deep operation or not
// ************************************************************************
```

The perf result at macbook 2021 max pro is:
```bash
-----------------------[ hasArr true, lessOp true ]-------------------
(reuseBase: true,  autoFreeze: true)  immer 2.797 ms : limu 1.287 ms
(reuseBase: false, autoFreeze: true)  immer 2.835 ms : limu 1.313 ms
(reuseBase: true,  autoFreeze: false) immer 2.049 ms : limu 0.089 ms
(reuseBase: false, autoFreeze: false) immer 2.096 ms : limu 0.146 ms

-----------------------[ hasArr true, lessOp false ]------------------
(reuseBase: true,  autoFreeze: true)  immer 2.946 ms : limu 1.268 ms
(reuseBase: false, autoFreeze: true)  immer 3.005 ms : limu 1.345 ms
(reuseBase: true,  autoFreeze: false) immer 2.162 ms : limu 0.147 ms
(reuseBase: false, autoFreeze: false) immer 2.169 ms : limu 0.161 ms

-----------------------[ hasArr false, lessOp true ]------------------
(reuseBase: true,  autoFreeze: true)  immer 2.253 ms : limu 0.659 ms
(reuseBase: false, autoFreeze: true)  immer 2.261 ms : limu 0.705 ms
(reuseBase: true,  autoFreeze: false) immer 1.472 ms : limu 0.058 ms
(reuseBase: false, autoFreeze: false) immer 1.504 ms : limu 0.064 ms

-----------------------[ hasArr false, lessOp true ]------------------
(reuseBase: true,  autoFreeze: true)  immer 2.086 ms : limu 0.604 ms
(reuseBase: false, autoFreeze: true)  immer 2.201 ms : limu 0.643 ms
(reuseBase: true,  autoFreeze: false) immer 1.383 ms : limu 0.022 ms
(reuseBase: false, autoFreeze: false) immer 1.42 ms  : limu 0.021 ms
```

### Submit your test
You are very welcome to submit your test to the benchmark directory


## License
Copyright (c) Tencent Corporation. All rights reserved.

Limu is released under the MIT License(https://opensource.org/licenses/MIT)
