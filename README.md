## limu 🍋
`limu` is short of **love immutable**, born for efficient creation and operation of immutable object.
<p align="center">
  <a href="https://concentjs.github.io/concent-doc">
    <img width="260" src="https://raw.githubusercontent.com/fantasticsoul/assets/master/limu/limu.png">
  </a>
</p>

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

## performance ⚡️
It is nearly more than 3 times faster than `immer`.

Run [Code](https://github.com/tnfe/limu/blob/main/benchmark/case1.js) below:
```js
const immer = require('immer');
const limu = require('limu');

immer.setAutoFreeze(false);

function getBase() {
  const base = { a: { b: { c: { d: { e: { f: { g: 1 } } } } } }, b: null };
  return base;
};


const base = { a: { b: { c: { d: { e: { f: { g: 1 } } } } } }, b: null };
const draft = lib.createDraft(base); // lib 是 limu 或 immer
draft.a.b.c.d.e.f.g = 999;

const draft2 = lib.createDraft(base);
delete draft2.b;



function oneBenchmark(lib, base) {
  const start = Date.now();
  for (let i = 0; i < 10000; i++) {
    const draft = lib.createDraft(base);
    draft.a.b.c.d.e.f.g = 999;
    const final = lib.finishDraft(draft);
    if (final === base) {
      throw new Error('should not be equal');
    }

    const draft2 = lib.createDraft(base);
    delete draft2.b;
    const final2 = lib.finishDraft(draft2);
    if (final2 === base) {
      throw new Error('should not be equal');
    }
    if (base.b !== null) {
      throw new Error('base.b should be null');
    }
  }

  console.log(`spend ${Date.now() - start} ms`);
}

console.log(' ------------- immer benchmark ------------- ');
const base1 = getBase();
for (let i = 0; i < 10; i++) {
  oneBenchmark(immer, base1);
}

console.log('\n ------------- limu benchmark ------------- ');
const base2 = getBase();
for (let i = 0; i < 10; i++) {
  oneBenchmark(limu, base2);
}
```

run 10 times with `immer`
```bash
spend 432 ms
spend 360 ms
spend 347 ms
spend 352 ms
spend 379 ms
spend 365 ms
spend 344 ms
spend 330 ms
spend 344 ms
spend 351 ms
```

run 10 times with `limu`
```bash
spend 233 ms
spend 173 ms
spend 145 ms
spend 136 ms
spend 133 ms
spend 131 ms
spend 135 ms
spend 134 ms
spend 133 ms
spend 134 ms
```


## License
Copyright (c) Tencent Corporation. All rights reserved.

Limu is released under the MIT License(https://opensource.org/licenses/MIT)
