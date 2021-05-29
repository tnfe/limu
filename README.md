## limu
`limu` is short of 'love immutable', born for efficient creation and operation of immutable object.

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

## performance
It's almost three times faster than `immer`

Run Code below:
```js
const im = require('immer');
// const im = require('limu');

var base = { a: { b: { c: 1 } }, b: null, c: [1, 2, 3] };
base.b = base.a.b;
base.b.c = 888;

var start = Date.now();
for (let i = 0; i < 10000; i++) {
  var draft = im.createDraft(base);
  draft.b.c = 999;
  const final = im.finishDraft(draft);

  var draft2 = im.createDraft(base);
  draft2.b.c = 1000;
  delete draft2.b.e;
  draft2.c.push(1000);
  draft2.c.pop();
  const final2 = im.finishDraft(draft2);
}
console.log(`spend ${Date.now() - start} ms`);
```

run 5 times with `immer`
```bash
spend 335 ms
spend 333 ms
spend 342 ms
spend 338 ms
spend 352 ms
```

run 5 times with `limu`
```bash
spend 125 ms
spend 128 ms
spend 129 ms
spend 118 ms
spend 119 ms
```

## todo 
- performance: compare with `immer`
- trap `delete` `push` `pop` [done]
- add test case
- support Map Set
