import type { ObjectLike } from '../src/index';
import * as limu from '../src/index';
// import * as limu from '../dist/limu-fast';
// import * as limu from '../dist/limu';
// import * as limu from '../benchmark/_mutative';
// import * as limu from '../benchmark/node_modules/immer';
// limu.enableMapSet();

// @ts-ignore only works for immer
if (limu.enableMapSet) {
  // @ts-ignore
  limu.enableMapSet();
}

// const RUN_PRODUCE = false; // only run createDrat/finishDraft for all test cases
const RUN_PRODUCE = true; // run createDrat/finishDraft、produce both for all test cases

// for script: npm run test_no
if (process.env.AUTO_FREEZE === '0') {
  // @ts-ignore
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

export const createDraft = limu.createDraft;
export const finishDraft = limu.finishDraft;
// @ts-ignore
export const current = limu.current;
export const produce = limu.produce;
export const produceWithPatches = noop;
// @ts-ignore
export const setAutoFreeze = limu.setAutoFreeze;
// @ts-ignore
export const isNewArch = () => (limu.getMajorVer ? limu.getMajorVer() >= 3 : true);
// @ts-ignore
export const getAutoFreeze = limu.getAutoFreeze || (() => true);

// limu.setAutoFreeze(true);

export const produceTip = (testDescribe: string) => `${testDescribe} (with produce)`;

export const createDraftTip = (testDescribe: string) => `${testDescribe} (with createDraft, finishDraft)`;

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
  skip?: boolean,
) {
  if (skip) return;
  describe(testSuitDesc, () => {
    test(createDraftTip(testCaseDesc), () => {
      const base = getBase();
      const draft = createDraft(base);
      // @ts-ignore avoid immer type warning
      operateDraft(draft, base);
      const final = finishDraft(draft);
      // @ts-ignore avoid immer type warning
      if (executeAssertLogic) executeAssertLogic(final, base);
    });

    if (RUN_PRODUCE) {
      test(produceTip(testCaseDesc), () => {
        const base = getBase();
        const final = produce(base, draft => {
          // @ts-ignore
          operateDraft(draft, base);
        });
        if (executeAssertLogic) executeAssertLogic(final, base);
      });
    }
  })
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

    if (RUN_PRODUCE) {
      test(produceTip(testCaseDesc), () => {
        const objBase = getObjectBase();
        const objNew = produce(objBase, objDraft => {
          operateDraft(objDraft, objBase);
        });
        executeAssertLogic(objNew, objBase);
      });
    }
  })
}

/**
 * 
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

    if (RUN_PRODUCE) {
      test(produceTip(testCaseDesc), () => {
        const mapBase = getMapBase();
        const mapNew = produce(mapBase, mapDraft => {
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

    if (RUN_PRODUCE) {
      test(produceTip(testCaseDesc), () => {
        const setBase = getSetBase();
        const setNew = produce(setBase, setDraft => {
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
    })
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
