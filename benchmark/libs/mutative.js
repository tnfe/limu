const mutative = require('mutative');

const finishHandlerMap = new Map();
let isAutoFreeze = false;

const mutativeBase = {
  finishDraft(draft) {
    return finishHandlerMap.get(draft)();
  },
  original(obj) {
    return mutative.original(obj);
  },
  // mutative 无全局设置冻结的函数，这里模拟一个
  setAutoFreeze(freeze) {
    isAutoFreeze = freeze;
  },
};

mutativeAuto = {
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
  ...mutativeBase,
};

module.exports = {
  createDraft(base, options) {
    if (isAutoFreeze) {
      return mutativeAuto.createDraft(base, options);
    }
    const [draft, finish] = mutative.create(base, {
      enableAutoFreeze: false,
      ...(options || {}),
    });
    finishHandlerMap.set(draft, finish);
    return draft;
  },
  produce(base, draftCb, options) {
    if (isAutoFreeze) {
      return mutativeAuto.produce(base, draftCb, options);
    }
    const produce = mutative.create(draftCb, {
      enableAutoFreeze: false,
      ...(options || {}),
    });
    const final = produce(base);
    return final;
  },
  ...mutativeBase,
};
