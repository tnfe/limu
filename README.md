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

Run Code below:
```js
// const im = require('immer');
const im = require('limu'); // or require('../dist/limu.min')

const base = { a: { b: { c: 1 } }, b: null, c: [1, 2, 3] };

function oneBenchmark() {
  const start = Date.now();
  for (let i = 0; i < 10000; i++) {
    const draft = im.createDraft(base);
    draft.a.b.c = 999;
    const final = im.finishDraft(draft);
    if (final === base) {
      throw new Error('should not be equal');
    }
    if (final.c !== base.c) {
      throw new Error('should be equal');
    }

    const draft2 = im.createDraft(base);
    draft2.a.b.c = 1000;
    delete draft2.b;
    draft2.c.push(1000);
    draft2.c.pop();
    const final2 = im.finishDraft(draft2);
    if (final2 === base) {
      throw new Error('should not be equal');
    }
    if (final2.c === base.c) {
      throw new Error('c arr should not be equal');
    }
  }

  console.log(`spend ${Date.now() - start} ms`);
}

for (let i = 0; i < 10; i++) {
  oneBenchmark();
}
```

run 5 times with `immer`
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

run 5 times with `limu`
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

concent is released under the MIT License. [http://www.opensource.org/licenses/mit-license](http://www.opensource.org/licenses/mit-license)
