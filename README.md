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



## todo 
- performance: compare with `immer`
- trap `delete` `push` `pop` [done]
- add test case
- support Map Set
