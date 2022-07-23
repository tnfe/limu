import { createDraft, finishDraft } from '../_util';

describe('complex-case1', () => {

  test('assign same draft node', () => {
    const base = {
      a: {
        b: {
          c: 1,
        },
        b1: {
          c: 100,
        }
      }
    };
    const draft = createDraft(base);
    draft.a.b = draft.a.b;
    const final = finishDraft(draft);

    expect(base === final).toBeTruthy();

  });

  test('assign another draft node', () => {
    const base = {
      a: {
        b: {
          c: 1,
        },
        b1: {
          c: 100,
        }
      }
    };
    const draft = createDraft(base);
    draft.a.b = draft.a.b1;
    const final = finishDraft(draft);

    expect(base !== final).toBeTruthy();
  });

});