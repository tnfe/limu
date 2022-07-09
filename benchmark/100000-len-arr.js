/**
 * before run this benchmark case you should mark sure execute npm command 'npm run install' in dir benchmark
 */
const immer = require('immer');
const limu = require('limu');

immer.setAutoFreeze(false);

function getBase() {
  const arr = new Array(1000).fill('');
  arr.forEach((val, idx, arr) => arr[idx] = idx);
  const base = { arr };
  return base;
};


function oneBenchmark(lib, base) {
  const start = Date.now();
  for (let i = 0; i < 100; i++) {
    const draft = lib.createDraft(base);
    draft.arr.forEach((val, idx, arr) => {
      const valBefore = arr[idx];
      arr[idx] = idx * 10 + 1;
      if (arr[idx] === valBefore) {
        throw new Error('should not be equal');
      }
    });
    const final = lib.finishDraft(draft);
    if (final === base) {
      throw new Error('should not be equal');
    }
  }
  console.log(`spend ${Date.now() - start} ms`);
}


console.log(' ------------- immer benchmark ------------- ');
const base1 = getBase();
for (let i = 0; i < 10; i++) {
  oneBenchmark(immer, base1);
}

// immer 和 limu 不能共用一个base，在未关闭 immer autoFreeze 功能的情况下
// 否则会导致 #<Object> is not extensible 错误，因为 immer 会冻结对象
console.log('\n ------------- limu benchmark ------------- ');
const base2 = getBase();
for (let i = 0; i < 10; i++) {
  oneBenchmark(limu, base2);
}
