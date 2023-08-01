import { createDraft, createTestSuit, finishDraft, getArrBase, runTestSuit, shouldBeEqual, shouldBeNotEqual } from '../_util';

function justSlice(arrDraft, arrBase) {
  const arrDraftNew = arrDraft.slice();
  expect(arrDraftNew !== arrBase).toBeTruthy();
}

runTestSuit('arr is base', 'slice', getArrBase, justSlice, shouldBeEqual);

runTestSuit(
  'arr in base obj',
  'slice',
  () => {
    // get base state
    return { arr: getArrBase() };
  },
  (draft, base) => {
    // change draft
    justSlice(draft.arr, base.arr);
  },
  (final, base) => {
    // assert
    expect(final === base).toBeTruthy();
    shouldBeEqual(final.arr, base.arr);
  },
);

function sliceThenChangeDraft(arrDraft, arrBase) {
  const arrDraftNew = arrDraft.slice();
  arrDraft.push(4);
  expect(arrDraftNew !== arrBase).toBeTruthy();
}

runTestSuit('arr is base', 'slice', getArrBase, sliceThenChangeDraft, shouldBeNotEqual);

runTestSuit(
  'arr in base obj',
  'slice',
  () => {
    // get base state
    return { arr: getArrBase() };
  },
  (draft, base) => {
    // change draft
    sliceThenChangeDraft(draft.arr, base.arr);
  },
  (final, base) => {
    // assert
    expect(final !== base).toBeTruthy();
    shouldBeNotEqual(final.arr, base.arr);
  },
);

runTestSuit(
  'push then slice',
  'slice',
  () => {
    // get base state
    return {
      a: {
        b: {
          c: [1, 2, 3],
        },
      },
    };
  },
  (draft, base) => {
    draft.a.b.c.push(4, 5);
    expect(base.a.b.c.length === 3).toBeTruthy();
    expect(draft.a.b.c.length === 5).toBeTruthy();
    const cListCopy = draft.a.b.c.slice();
    cListCopy.push(6);

    expect(base.a.b.c.length === 3).toBeTruthy();
    expect(draft.a.b.c.length === 5).toBeTruthy();
    expect(cListCopy.length === 6).toBeTruthy();
  },
  (final, base) => {
    // assert
    expect(final === base).toBeFalsy();
  },
);

runTestSuit(
  'slice then push',
  'slice',
  () => {
    // get base state
    return {
      a: {
        b: {
          c: [1, 2, 3],
        },
      },
    };
  },
  (draft, base) => {
    const cListCopy = draft.a.b.c.slice();
    cListCopy.push(4);
    expect(base.a.b.c.length === 3).toBeTruthy();
    expect(draft.a.b.c.length === 3).toBeTruthy();
    expect(cListCopy.length === 4).toBeTruthy();
  },
  (final, base) => {
    // assert
    expect(final === base).toBeTruthy();
  },
);

const suit = createTestSuit('slice');

suit
  .addTest('see slice revoke', () => {
    const base = {
      a: {
        b: {
          c: [{ n: 1 }, { n: 2 }, { n: 3 }],
        },
      },
    };
    const draft = createDraft(base);
    draft.a.b.c.push({ n: 4 });
    expect(base.a.b.c.length === 3).toBeTruthy();
    expect(draft.a.b.c.length === 4).toBeTruthy();
    const cListCopy = draft.a.b.c.slice();
    cListCopy.push({ n: 5 });

    expect(base.a.b.c.length === 3).toBeTruthy();
    expect(draft.a.b.c.length === 4).toBeTruthy();
    expect(cListCopy.length === 5).toBeTruthy();

    draft.a.b.c[2].n = 300;
    expect(draft.a.b.c[2].n === 300).toBeTruthy();
    expect(cListCopy[2].n === 300).toBeTruthy();

    cListCopy[4].n = 500;
    expect(draft.a.b.c[4] === undefined).toBeTruthy();
    expect(cListCopy[4].n === 500).toBeTruthy();

    cListCopy[0].n = 100;
    expect(base.a.b.c[0].n === 1).toBeTruthy();
    expect(draft.a.b.c[0].n === 100).toBeTruthy();
    expect(cListCopy[0].n === 100).toBeTruthy();

    const next = finishDraft(draft);
    expect(next === base).toBeFalsy();

    try {
      expect(cListCopy[0].n === 100).toBeTruthy();
    } catch (err: any) {
      console.log(err);
      // expect(err.message.includes('Cannot perform \'get\' on a proxy that has been revoked')).toBeTruthy();
    }
  })
  .run();
