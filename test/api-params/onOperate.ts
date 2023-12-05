import { createDraft } from '../../src';
import { noop } from '../_util';

function dictFictory() {
  return {
    a: {
      b: { c: 1 },
      b1: { c1: 1 },
    },
    num: 1,
    info: { name: 'helux', age: 1 },
    desc: 'awesome lib',
    extra: {
      mark: 'extra',
      list: [
        { id: 1, name: 'helux1' },
        { id: 2, name: 'helux2' },
      ],
      map: new Map([
        [1, { id: 1, name: 'helux1' }],
        [2, { id: 2, name: 'helux2' }],
      ]),
    },
  };
}

describe('check onOperate grandpaType', () => {

  test('onOperate: map type', () => {
    const base = dictFictory();
    const draft = createDraft(base, {
      onOperate: (params) => {
        const { fullKeyPath, grandpaType } = params;
        if(fullKeyPath[fullKeyPath.length-1] === 'name'){
          expect(grandpaType).toBe('Map');
        }
      },
    });
    noop(draft.extra.map.get(1)?.name);
  });

});
