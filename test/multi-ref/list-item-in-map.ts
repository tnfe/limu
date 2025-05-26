// @ts-nocheck
import { createDraft, finishDraft, isDraft } from '../_util';

describe('list-item-in-map', () => {
  test('base multi ref', () => {
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
    expect(draft.list[0].name === 'new').toBeTruthy();
    expect(draft.list[0] === draft.dict.item).toBeTruthy();

    const final = finishDraft(draft);
    expect(base !== final).toBeTruthy();
    expect(base.dict.item.name === 'item1').toBeTruthy();
    expect(base.list[0].name === 'item1').toBeTruthy();
    expect(final.dict.item.name === 'new').toBeTruthy();
    expect(final.list[0].name === 'new').toBeTruthy();

    expect(base.list[0] === base.dict.item).toBeTruthy();
    expect(final.list[0] === final.dict.item).toBeTruthy();
    expect(final.list[0] !== base.dict.item).toBeTruthy();
  });

  test('base multi ref 2 depth', () => {
    const base = {
      list: [{ name: 'item1', subList: [{ name: 'subName' }] }],
    };
    base.dict = {
      another: {
        sub: {
          item: base.list[0].subList[0],
        }
      }
    };

    const draft = createDraft(base);
    draft.dict.another.sub.item.name = 'new';

    expect(draft.dict.another.sub.item.name === 'new').toBeTruthy();
    expect(draft.list[0].subList[0].name === 'new').toBeTruthy();

    const final = finishDraft(draft);
    expect(base !== final).toBeTruthy();
  });

  test('assign draft multi ref', () => {
    const base = {
      list: [{ name: 'item1', subList: [{ name: 'oldName' }] }],
    };

    const draft = createDraft(base);
    draft.dict = {
      another: {
        sub: {
          item: base.list[0].subList[0],
        }
      }
    };
    draft.dict.another.sub.item.name = 'newName';

    expect(draft.dict.another.sub.item.name).toBe('newName');
    expect(draft.dict.another.sub.item.name === 'newName').toBeTruthy();
    expect(draft.list[0].subList[0].name === 'newName').toBeTruthy();
    expect(base.dict === undefined).toBeTruthy();

    const final = finishDraft(draft);
    expect(base !== final).toBeTruthy();
    expect(final.dict.another.sub.item.name === 'newName').toBeTruthy();
    expect(final.list[0].subList[0].name === 'newName').toBeTruthy();
    expect(base.dict === undefined).toBeTruthy();
    expect(base.list[0].subList[0].name === 'oldName').toBeTruthy();
  });
});
