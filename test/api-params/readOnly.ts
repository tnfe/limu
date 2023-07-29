
import { createDraft, finishDraft } from '../_util';

describe('param readOnly', () => {
  test('test onOperate', () => {
    const base = { a: 50, b: 2, c: { d: { e: 1 } } };
    let getHit = 0;
    let delHit = 0;

    const draft = createDraft(base, {
      readOnly: true,
      onOperate(opParams) {
        getHit += 1; // only get under readOnly=true mode
        if (opParams.op === 'del') {
          delHit += 1;
        }
      },
    });
    draft.a = 500;
    draft.c.d.e = 100; // get c d
    expect(draft.a === 50).toBeTruthy(); // get a
    expect(draft.c.d.e === 1).toBeTruthy(); // get c d e

    base.a = 500;
    base.c.d.e = 100;
    expect(draft.a === 50).toBeFalsy(); // get a
    expect(draft.c.d.e === 1).toBeFalsy(); // get c d e

    // @ts-ignore
    delete draft.a;
    expect(draft.a === 500).toBeTruthy(); // get a
    expect(base.a === 500).toBeTruthy();

    // @ts-ignore
    delete base.a;
    expect(draft.a === undefined).toBeTruthy(); // get a
    expect(base.a === undefined).toBeTruthy();

    expect(getHit === 12).toBeTruthy();
    expect(delHit === 0).toBeTruthy();

    const next = finishDraft(draft);
    expect(next === base).toBeTruthy();
  });
});
