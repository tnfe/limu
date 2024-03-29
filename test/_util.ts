// @ts-nocheck
import type { ObjectLike } from '../src/index';
import * as limu from '../src/index'; // test limu source code
// import * as limu from '../benchmark/libs/limu'; // test limu compiled code
// import { lib as limu } from '../benchmark/libs/mutative'; // test mutative
// import * as limu from '../benchmark/libs/immer'; // test mutative

if (limu.enableMapSet) {
  limu.enableMapSet();
}

// const RUN_PRODUCE = false; // only run createDrat/finishDraft for all test cases
const RUN_PRODUCE = true; // run createDrat/finishDraft、produce both for all test cases

// for script: npm run test_no
if (process.env.AUTO_FREEZE === '0') {
  limu.setAutoFreeze(false);
}

// 本地 jest 运行时为了方便定位console上显示的错误代码位置，可使用 dist的源码做调试，注意要先执行 npm run build
// 如果为了调试源码，可去 debug 目录加用例并测试，debug 配置参考如下
/*
{
  "type": "node",
  "request": "launch",
  "name": "limu case 1",
  "skipFiles": ["<node_internals>/**"],
  "program": "${workspaceFolder}/debug/case1.js",
  "console": "integratedTerminal"
}
*/
// import * as limu from '../dist/limu.js';
// import * as limu from 'immer';
// limu.enableMapSet();

export const isDraft = limu.isDraft;
export const createDraft = limu.createDraft;
export const finishDraft = limu.finishDraft;
export const current = limu.current;
export const produce = limu.produce;
export const produceWithPatches = noop;
export const setAutoFreeze = limu.setAutoFreeze;

/**
 * 因 3.0 做了大的架构改进，让其行为和 immer 保持了 100% 一致，和 2.0 版本处于不兼容状态
 * 此处标记版本号辅助测试用例为2.0走一些特殊逻辑
 */
export const isNewArch = () => (limu.VER ? parseInt(limu.VER.substring(0, 1), 10) >= 3 : true);
export const getAutoFreeze = limu.getAutoFreeze || (() => true);

// limu.setAutoFreeze(true);

export const produceTip = (testDescribe: string) => `${testDescribe} (with produce)`;

export const createDraftTip = (testDescribe: string) => `${testDescribe} (with createDraft, finishDraft)`;

export const createDraftDebugTip = (testDescribe: string) => `${testDescribe} ([debugMode] with createDraft, finishDraft)`;

export const strfy = (obj: any, space?: number) => {
  if (typeof obj === 'string') return obj;
  return JSON.stringify(obj, null, space ?? 0);
};

export const logStr = (obj: any, space?: number) => console.log(strfy(obj, space));

export const logLabeledStr = (label, obj: any, space?: number) => console.log(label, strfy(obj, space));

/**
 * allow noop pass any params
 */
export function noop(...args: any[]) {
  return args;
}

/**
 * common getMapBase handler
 * @returns
 */
export function getMapBase() {
  return new Map([
    ['k1', 1],
    ['k2', 2],
    ['k3', 3],
  ]);
}

/**
 * common getMapObjBase handler
 * @returns
 */
export function getMapObjBase() {
  return new Map([
    ['k1', { name: 'k1' }],
    ['k2', { name: 'k2' }],
    ['k3', { name: 'k3' }],
  ]);
}

/**
 * common getArrBase handler
 * @returns
 */
export function getArrBase() {
  // const arr = new Array(10).fill('');
  // // @ts-ignore
  // arr.forEach((val, idx, arr) => arr[idx] = idx);
  // return arr;
  return [1, 2, 3];
}

/**
 * common getArrBase handler
 * @returns
 */
export function getSetBase() {
  return new Set([1, 2, 3]);
}

/**
 * common getArrBase handler
 * @returns
 */
export function getSetObjBase() {
  return new Set([{ name: 'k1' }, { name: 'k2' }, { name: 'k3' }]);
}

// const jestExpect = expect;

// // @ts-ignore
// global.expect = (actual: any) => {
//   const fns = jestExpect(actual);
//   fns.toMatchObject = (toMatch) => {
//     const actualStr = strfy(actual);
//     const expectStr = strfy(toMatch);
//     if (actualStr !== expectStr) {
//       console.log(`actual is ${actualStr}`);
//       console.log(`expect is ${expectStr}`);
//       throw new Error('call toMatchObject fail');
//     }
//   };
//   return fns;
// };

export function expectToBe(actualVal, exceptVal) {
  expect(actualVal).toBe(exceptVal);
}

export function exceptNotEqual(actualVal, exceptVal) {
  expect(actualVal === exceptVal).toBeFalsy();
}

/**
 * common compare handler
 * new and base should be equal
 */
export function shouldBeEqual(stateNew, stateBase) {
  expect(stateNew === stateBase).toBeTruthy();
}
/**
 * common compare handler
 * new and base should be not equal
 */
export function shouldBeNotEqual(final, base) {
  expect(final !== base).toBeTruthy();
}

/**
 * use (createDraftTip,finishDraft) and (produce) to test target case
 * @param testSuitDesc
 * @param testCaseDesc
 * @param getBase
 * @param operateDraft
 * @param executeAssertLogic
 */
export function runTestSuit<T extends ObjectLike = ObjectLike>(
  testSuitDesc: string,
  testCaseDesc: string,
  getBase: () => T,
  operateDraft: (draft: T, base: T) => void,
  executeAssertLogic?: (final: T, base: T) => void,
  options?: any,
) {
  // @ts-ignore sort test case only works for limu cause its shallow copy on read mechanism
  if (testCaseDesc.includes('ordered sort') && !limu.Limu) {
    runEmptyTestSuit();
    return;
  }

  describe(testSuitDesc, () => {
    test(createDraftTip(testCaseDesc), () => {
      const base = getBase();
      const draft = createDraft(base, options);
      operateDraft(draft, base);
      const final = finishDraft(draft);
      if (executeAssertLogic) executeAssertLogic(final, base);
    });

    // test debug situation
    test(createDraftDebugTip(testCaseDesc), () => {
      const base = getBase();
      const draft = createDraft(base, { ...(options || {}), debug: true });
      operateDraft(draft, base);
      const final = finishDraft(draft);
      if (executeAssertLogic) executeAssertLogic(final, base);
    });

    if (RUN_PRODUCE) {
      test(produceTip(testCaseDesc), () => {
        const base = getBase();
        const final = produce(
          base,
          (draft) => {
            operateDraft(draft, base);
          },
          options,
        );
        if (executeAssertLogic) executeAssertLogic(final, base);
      });
    }
  });
}

type Dict = any;

export function runObjectTestSuit(
  testSuitDesc: string,
  testCaseDesc: string,
  getObjectBase: () => Dict,
  operateDraft: (objDraft: Dict, objBase: Dict) => void,
  executeAssertLogic: (objNew: Dict, objBase: Dict) => void,
) {
  describe(testSuitDesc, () => {
    test(createDraftTip(testCaseDesc), () => {
      const objBase = getObjectBase();
      const objDraft = createDraft(objBase);
      operateDraft(objDraft, objBase);
      const objNew = finishDraft(objDraft);
      executeAssertLogic(objNew, objBase);
    });

    test(createDraftTip(testCaseDesc), () => {
      const objBase = getObjectBase();
      const objDraft = createDraft(objBase, { debug: true });
      operateDraft(objDraft, objBase);
      const objNew = finishDraft(objDraft);
      executeAssertLogic(objNew, objBase);
    });

    if (RUN_PRODUCE) {
      test(produceTip(testCaseDesc), () => {
        const objBase = getObjectBase();
        const objNew = produce(objBase, (objDraft) => {
          operateDraft(objDraft, objBase);
        });
        executeAssertLogic(objNew, objBase);
      });
    }
  });
}

/**
 * @param testSuitDesc
 * @param testCaseDesc
 * @param getMapBase
 * @param operateDraft
 * @param executeAssertLogic
 */
export function runMapTestSuit(
  testSuitDesc: string,
  testCaseDesc: string,
  getMapBase: () => Map<any, any>,
  operateDraft: (arrDraft: Map<any, any>, arrBase: Map<any, any>) => void,
  executeAssertLogic: (arrNew: Map<any, any>, arrBase: Map<any, any>) => void,
) {
  describe(testSuitDesc, () => {
    test(createDraftTip(testCaseDesc), () => {
      const mapBase = getMapBase();
      const mapDraft = createDraft(mapBase);
      operateDraft(mapDraft, mapBase);
      const mapNew = finishDraft(mapDraft);
      executeAssertLogic(mapNew, mapBase);
    });

    test(createDraftTip(testCaseDesc), () => {
      const mapBase = getMapBase();
      const mapDraft = createDraft(mapBase, { debug: true });
      operateDraft(mapDraft, mapBase);
      const mapNew = finishDraft(mapDraft);
      executeAssertLogic(mapNew, mapBase);
    });

    if (RUN_PRODUCE) {
      test(produceTip(testCaseDesc), () => {
        const mapBase = getMapBase();
        const mapNew = produce(mapBase, (mapDraft) => {
          operateDraft(mapDraft, mapBase);
        });
        executeAssertLogic(mapNew, mapBase);
      });
    }
  });
}

/**
 *
 * @param testSuitDesc
 * @param testCaseDesc
 * @param getSetBase
 * @param operateDraft
 * @param executeAssertLogic
 */
export function runSetTestSuit(
  testSuitDesc: string,
  testCaseDesc: string,
  getSetBase: () => Set<any>,
  operateDraft: (setDraft: Set<any>, setBase: Set<any>) => void,
  executeAssertLogic: (setNew: Set<any>, setBase: Set<any>) => void,
) {
  describe(testSuitDesc, () => {
    test(createDraftTip(testCaseDesc), () => {
      const setBase = getSetBase();
      const setDraft = createDraft(setBase);
      operateDraft(setDraft, setBase);
      const setNew = finishDraft(setDraft);
      executeAssertLogic(setNew, setBase);
    });

    test(createDraftDebugTip(testCaseDesc), () => {
      const setBase = getSetBase();
      const setDraft = createDraft(setBase, { debug: true });
      operateDraft(setDraft, setBase);
      const setNew = finishDraft(setDraft);
      executeAssertLogic(setNew, setBase);
    });

    if (RUN_PRODUCE) {
      test(produceTip(testCaseDesc), () => {
        const setBase = getSetBase();
        const setNew = produce(setBase, (setDraft) => {
          operateDraft(setDraft, setBase);
        });
        executeAssertLogic(setNew, setBase);
      });
    }
  });
}

export function runEmptyTestSuit() {
  describe('empty suite', () => {
    test('empty case', () => {
      expect(1 === 1).toBeTruthy();
    });
  });
}

export function assignFrozenDataInJest(cb: any) {
  try {
    cb();
  } catch (e: any) {
    // jest will throw the error below from jest-circus/build/utils.js
    // Cannot assign to read only property 'key' of object '#<Object>'
    expect(e.message).toMatch(/(?=Cannot)/);
  }
}

export function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export function createTestSuit(descStr) {
  const tests = [];
  const result = {
    addTest(testCaseStr, cb) {
      tests.push({ label: testCaseStr, cb });
      return result;
    },
    run() {
      describe(descStr, () => {
        tests.forEach((item) => {
          test(item.label, item.cb);
        });
      });
    },
  };
  return result;
}
