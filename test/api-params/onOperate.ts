import { createDraft } from '../../src';
import { dictFictory } from '../_data';

describe('check onOperate', () => {
  test('onOperate: set map item same value', () => {
    const base = dictFictory();
    const draft = createDraft(base, {
      onOperate: (params) => {
        const { fullKeyPath, isChanged } = params;
        if (fullKeyPath[fullKeyPath.length - 1] === 'name') {
          expect(isChanged).toBe(false);
        }
      },
    });
    const item = draft.extra.map.get(1);
    if (item) {
      item.name = item.name;
    }
  });

  test('onOperate: set map item different value', () => {
    const base = dictFictory();
    const draft = createDraft(base, {
      onOperate: (params) => {
        const { fullKeyPath, isChanged, op } = params;
        if (fullKeyPath[fullKeyPath.length - 1] === 'name' && op !== 'get') {
          expect(isChanged).toBe(true);
        }
      },
    });
    const item = draft.extra.map.get(1);
    if (item) {
      item.name = item.name + 'new';
    }
  });

  test('onOperate: set map item 2 times ( new_1, new_1 ) ', () => {
    const base = dictFictory();

    let count = 0;
    const draft = createDraft(base, {
      onOperate: (params) => {
        const { fullKeyPath, isChanged, op } = params;
        if (fullKeyPath[fullKeyPath.length - 1] === 'name' && op !== 'get') {
          count += 1;
          if (count === 1) {
            // 第一次变了
            expect(isChanged).toBe(true);
          } else {
            // 第一次没变
            expect(isChanged).toBe(false);
          }
        }
      },
    });
    const item = draft.extra.map.get(1);
    if (item) {
      item.name = 'new_1';
      item.name = 'new_1';
    }
  });

  test('onOperate: set map item 2 times ( new_1, new_2 ) ', () => {
    const base = dictFictory();

    const draft = createDraft(base, {
      onOperate: (params) => {
        const { fullKeyPath, isChanged, op } = params;
        if (fullKeyPath[fullKeyPath.length - 1] === 'name' && op !== 'get') {
          expect(isChanged).toBe(true); // always true
        }
      },
    });
    const item = draft.extra.map.get(1);
    if (item) {
      item.name = 'new_1';
      item.name = 'new_2';
    }
  });

  test('onOperate: set map item 3 times ( new_1, new_2, new_2 ) ', () => {
    const base = dictFictory();

    let count = 0;
    const draft = createDraft(base, {
      onOperate: (params) => {
        const { fullKeyPath, isChanged, op } = params;
        if (fullKeyPath[fullKeyPath.length - 1] === 'name' && op !== 'get') {
          count += 1;
          if (count === 1) {
            // 第1次变了
            expect(isChanged).toBe(true);
          } else if (count === 2) {
            // 第2次变了
            expect(isChanged).toBe(true);
          } else {
            // 第3次没变
            expect(isChanged).toBe(false);
          }
        }
      },
    });
    const item = draft.extra.map.get(1);
    if (item) {
      item.name = 'new_1';
      item.name = 'new_2';
      item.name = 'new_2';
    }
  });
});
