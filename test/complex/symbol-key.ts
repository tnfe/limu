import { createDraft, finishDraft } from '../_util';

describe('symbol-key', () => {
  test('base with symbol keys', () => {
    const sdutentKey = Symbol('sdutent');
    const base = {
      [sdutentKey]: {
        b: {
          c: 1,
        },
        b1: {
          c: 100,
        },
      },
    };
    const draft = createDraft(base);
    draft[sdutentKey].b.c = 2;
    expect(draft[sdutentKey].b.c).toBe(2);
    const final = finishDraft(draft);

    expect(base === final).toBeFalsy();
  });

  test('set draft symbol key', () => {
    const sdutentKey = Symbol('sdutent');
    const base = {
      [sdutentKey]: {
        b: {
          c: 1,
        },
        b1: {
          c: 100,
        },
      },
      info: {
        name: { first: 'first', last: 'last' },
      },
      other: {
        info: {},
      },
    };
    const draft = createDraft(base);
    draft[sdutentKey].b.c = 2;
    draft.info[sdutentKey] = draft.info.name;
    draft.other.info[sdutentKey] = draft.info.name;
    draft.other.info[sdutentKey].first = 'new first';

    expect(draft.info[sdutentKey].first).toBe('new first');
    expect(draft.other.info[sdutentKey].first).toBe('new first');
    const final = finishDraft(draft);

    expect(base === final).toBeFalsy();
  });
});
