import { createDraft, finishDraft } from '../_util';

describe('for helux', () => {
  test('success in jest but fail in vitest', async () => {
    const base = [
      { a: 1, b: { name: 2 } },
      { a: 2, b: { name: 4 } },
    ];
    const draft = createDraft(base);
    draft[0].b.name = 100;
    const next = finishDraft(draft);

    expect(base[0] === next[0]).toBeFalsy();
    expect(base[1] === next[1]).toBeTruthy();
  });
});
