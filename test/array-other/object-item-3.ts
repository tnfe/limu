import { produce } from '../../src';

describe('an online demo', () => {
  test('case 1', () => {
    const inits = [
      {
        id: '1',
        name: '张三',
      },
      {
        id: '2',
        name: '李四',
      },
    ];

    const nextState = produce(inits, (_state) => {
      _state.forEach((o) => {
        o.name = '王二麻子' + Date.now();
      });
    });
    expect(nextState === inits).toBeFalsy();
  });

  test('case 2', () => {
    const inits = [
      {
        id: '1',
        name: '张三',
      },
      {
        id: '2',
        name: '李四',
      },
    ];

    const nextState = produce(inits, (_state) => {
      _state.forEach((o) => {
        if (o.id === '1') o.name = '王二麻子';
      });
    });

    expect(nextState !== inits).toBeTruthy();
    expect(nextState[0] !== inits[0]).toBeTruthy();
    expect(nextState[1] === inits[1]).toBeTruthy();
  });

  test('case 3', () => {
    const inits = {
      list: [
        {
          id: '1',
          name: '张三',
        },
        {
          id: '2',
          name: '李四',
        },
      ],
    };

    const nextState = produce(inits, (_state) => {
      _state.list.forEach((o) => {
        if (o.id === '1') o.name = '王二麻子';
      });
    });

    expect(nextState !== inits).toBeTruthy();
    expect(nextState.list[0] !== inits.list[0]).toBeTruthy();
    expect(nextState.list[1] === inits.list[1]).toBeTruthy();
  });
});
