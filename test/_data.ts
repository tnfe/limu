export function dictFictory() {
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
