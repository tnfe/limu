/**
 * before run this benchmark case you should mark sure execute npm command 'npm run build' in local
 */
// const im = require('immer');
const im = require('../dist/limu.min');
const arr = new Array(1000).fill('');
arr.forEach((val, idx, arr) => arr[idx] = idx);
const base = { arr };

function oneBenchmark() {
  const start = Date.now();
  for (let i = 0; i < 100; i++) {
    const draft = im.createDraft(base);
    draft.arr.forEach((val, idx, arr) => {
      // console.log('arr[idx] before ', arr[idx]);
      arr[idx] = idx * 10;
      // console.log('arr[idx] after ', arr[idx]);
    });
    const final = im.finishDraft(draft);
    if (final === base) {
      throw new Error('should not be equal');
    }
  }
  console.log(`spend ${Date.now() - start} ms`);
}

for (let i = 0; i < 10; i++) {
  oneBenchmark();
}
