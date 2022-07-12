/**
 * before run this benchmark case you should mark sure execute npm command 'npm run install' in dir benchmark
 */
const immer = require('immer');
const limu = require('limu');

immer.setAutoFreeze(false);
limu.setAutoFreeze(false);

function getBase() {
  return {
    info: Array.from(Array(10000).keys()),
  };
};


function oneBenchmark(lib, base, label) {
  // const start = Date.now();
  console.time(label);
  lib.produce(base, (draft) => {
    draft.info[2000] = 0;
  });
  console.timeEnd(label);
  // console.log(`spend ${Date.now() - start} ms`);
}


console.log(' ------------- immer benchmark ------------- ');
const base1 = getBase();
for (let i = 0; i < 10; i++) {
  oneBenchmark(immer, base1, 'immer');
}

console.log('\n ------------- limu benchmark ------------- ');
const base2 = getBase();
for (let i = 0; i < 10; i++, 'limu') {
  oneBenchmark(limu, base2);
}
