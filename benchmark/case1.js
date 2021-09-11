/**
 * before run this benchmark case you should mark sure execute npm command 'npm run build' in local
 */
// const im = require('immer');
const im = require('../dist/limu.min');

var base = { a: { b: { c: 1 } }, b: null, c: [1, 2, 3] };

function oneTask() {
  var start = Date.now();
  for (let i = 0; i < 10000; i++) {
    var draft = im.createDraft(base);
    draft.a.b.c = 999;
    const final = im.finishDraft(draft);
    if (final === base) {
      throw new Error('should not be equal');
    }
    if (final.c !== base.c) {
      throw new Error('should be equal');
    }

    var draft2 = im.createDraft(base);
    draft2.a.b.c = 1000;
    delete draft2.b;
    draft2.c.push(1000);
    // draft2.c.pop();
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
  oneTask();
}