import { produce } from '../../src';

describe('case 1', () => {
  test('case 1 detail', () => {
    const baseMap = new Map<'michel', { name: string; info: any }>([
      ['michel', { name: 'fantasticsoul', info: { name: 'ok', addr: 'bj' } }],
    ]);

    const finalMap = produce(baseMap, (draft) => {
      // @ts-ignore
      draft.get('michel').info.addr = 'sh';
    });

    expect(baseMap.get('michel')?.info.addr).toBe('bj');
    expect(finalMap.get('michel')?.info.addr).toBe('sh');
  });
});
