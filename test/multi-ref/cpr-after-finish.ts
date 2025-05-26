// @ts-nocheck
import { createDraft, finishDraft, isDraft } from '../_util';

describe('cpr-after-finish', () => {
  test('2 refs, only change 1', () => {
    const base = {
      list: [{ name: 'item1' }],
    };
    base.dict = {
      item: base.list[0],
    };

    const draft = createDraft(base);
    draft.dict.item.name = 'new';

    // dict item
    expect(draft.dict.item.name === 'new').toBeTruthy();
    const final = finishDraft(draft);
    expect(base !== final).toBeTruthy();
    expect(base.dict.item.name === 'item1').toBeTruthy();
    expect(base.list[0].name === 'item1').toBeTruthy();
    expect(final.dict.item.name === 'new').toBeTruthy();
    expect(final.list[0].name === 'new').toBeTruthy();

    // expect(final.dict.item.name).toBe('new');
    // expect(final.list[0].name).toBe('new');
    // expect(final.list[0].name === 'new').toBeTruthy();

    // expect(base.list[0] === base.dict.item).toBeTruthy();
    // expect(final.list[0] === final.dict.item).toBeTruthy();
    // expect(final.list[0] !== base.dict.item).toBeTruthy();
  });
});
