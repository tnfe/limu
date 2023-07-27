const mutative = require('mutative');

const finishHandlerMap = new Map();

const libBase = {
  finishDraft(draft) {
    return finishHandlerMap.get(draft)();
  },
  original(obj) {
    return mutative.original(obj);
  },
  setAutoFreeze() {
    // do nothing
  },
};

// mutative 无全局设置冻结的函数，这里手动区分冻结与不冻结的入口

exports.libAuto = {
  createDraft(base, options) {
    const [draft, finish] = mutative.create(base, {
      enableAutoFreeze: true,
      ...(options || {}),
    });
    finishHandlerMap.set(draft, finish);
    return draft;
  },
  produce(base, draftCb, options) {
    const produce = mutative.create(draftCb, {
      enableAutoFreeze: true,
      ...(options || {}),
    });
    const final = produce(base);
    return final;
  },
  ...libBase,
};

exports.lib = {
  createDraft(base, options) {
    const [draft, finish] = mutative.create(base, {
      enableAutoFreeze: false,
      ...(options || {}),
    });
    finishHandlerMap.set(draft, finish);
    return draft;
  },
  produce(base, draftCb, options) {
    const produce = mutative.create(draftCb, {
      enableAutoFreeze: false,
      ...(options || {}),
    });
    const final = produce(base);
    return final;
  },
  ...libBase,
};
