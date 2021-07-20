import { produce } from '../../src';

// describe('an online demo', () => {
//   test('case 1', () => {
//     const inits = [
//       {
//         id: "1",
//         name: "张三"
//       },
//       {
//         id: "2",
//         name: "李四"
//       }
//     ];

//     const nextState = produce(inits, (_state) => {
//       _state.forEach((o) => {
//         o.name = "王二麻子" + Date.now();
//       });
//     });
//     expect(nextState !== inits).toBeTruthy();
//   });
// });

describe('an online demo 2', () => {
  test('case 1', () => {
    const inits = [
      {
        id: "1",
        name: "张三"
      },
      {
        id: "2",
        name: "李四"
      }
    ];

    const nextState = produce(inits, (_state) => {
      _state.forEach((o) => {
        // console.log(' in in  _state.forEach');
        if (o.id === '1') o.name = "王二麻子";
        // console.log('_state ', _state);
      });
    });

    console.log('nextState[0]', nextState[0]);
    console.log('inits[0]', inits[0]);

    console.log(nextState === inits); // false
    console.log(nextState[0] === inits[0]); // false
    console.log(nextState[1] === inits[1]); // true

    expect(nextState[0] !== inits[0]).toBeTruthy();
    expect(nextState[1] === inits[1]).toBeTruthy();

  });
});

