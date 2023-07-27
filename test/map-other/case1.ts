import { produce } from '../../src';

describe('case 1', () => {
  test('case 1 detail', () => {
    const usersById_v1 = new Map<'michel', { name: string; country: string }>([['michel', { name: 'Michel Weststrate', country: 'NL' }]]);

    const usersById_v2 = produce(usersById_v1, (draft) => {
      // @ts-ignore
      draft.get('michel').country = 'UK';
    });

    // @ts-ignore
    expect(usersById_v1.get('michel').country).toBe('NL');
    expect(usersById_v2).toBeTruthy();
    // @ts-ignore
    expect(usersById_v2.get('michel').country).toBe('UK');
  });
});
