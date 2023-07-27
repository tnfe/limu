import { produce } from '../../src';

describe('see-frozen', () => {
  test('case 1', () => {
    const baseMap = new Map<string, { name: string; info: any }>([['michel', { name: 'fantasticsoul', info: { name: 'ok', addr: 'bj' } }]]);

    const final = produce(baseMap, (draft) => {
      // @ts-ignore
      draft.get('michel').info.name = 'cool';
      draft.set('halo', {
        name: 'limu',
        info: { name: 'fast', addr: 'small size' },
      });
    });

    expect(final === baseMap).toBeFalsy();
    expect(final.get('michel')?.info.name).toBe('cool');
    expect(final.size).toBe(2);
    expect(baseMap.get('michel')?.info.name).toBe('ok');
    expect(baseMap.size).toBe(1);
  });
});
