import { createDraft, finishDraft, limuUtils, markRaw } from '../../src';

describe('markRaw', () => {
  test('should change all snap same node', () => {
    const base = { a: { key: null as any } };

    const draft = createDraft(base);
    draft.a.key = markRaw({ sub: 1 });
    const node1 = draft.a.key; // 新增对象不被转为代理
    expect(limuUtils.isMardedRaw(node1)).toBeTruthy();
    const next = finishDraft(draft);

    const draft2 = createDraft(next);
    const node2 = draft2.a.key; // 再次读取时，因被 markRaw 标记， node 节点不会被转为代理
    expect(limuUtils.isMardedRaw(node2)).toBeTruthy();
    node2.sub = 100;
    const next2 = finishDraft(draft2);

    // 由于 markRaw 标记导致对象失去结构共享特性，node 节点在所有快照里指向同一个引用，
    // 故修改值后会影响所有快照里的被 markRaw 标记的节点
    expect(next.a.key.sub === 100).toBeTruthy();
    expect(next2.a.key.sub === 100).toBeTruthy();
  });

  test('no markRaw', () => {
    const base = { a: { key: null as any } };

    const draft = createDraft(base);
    draft.a.key = { sub: 1 };
    const next = finishDraft(draft);

    const draft2 = createDraft(next);
    const node2 = draft2.a.key;
    node2.sub = 100;
    const next2 = finishDraft(draft2);

    expect(next.a.key.sub === 1).toBeTruthy();
    expect(next2.a.key.sub === 100).toBeTruthy();
  });
});
