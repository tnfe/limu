import { createDraft, finishDraft, produce } from '../src/index';

export const produceTip = (testDescribe: string) => `${testDescribe} (with produce)`;

export const createDraftTip = (testDescribe: string) => `${testDescribe} (with createDraft, finishDraft)`;

/**
 * allow noop pass any params
 */
export function noop(...args: any[]) {
  if (args === []) console?.log(args);
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

/**
 * common compare handler
 * new and base should be equal
 */
export function shouldBeEqual(stateNew, stateBase) {
  console.log('shouldBeEqual');
  expect(stateNew === stateBase).toBeTruthy();
}
/**
 * common compare handler
 * new and base should be not equal
 */
export function shouldBeNotEqual(stateNew, stateBase) {
  expect(stateNew !== stateBase).toBeTruthy();
}

/**
 * 
 * @param testSuitDesc 
 * @param testCaseDesc 
 * @param getArrBase
 * @param operateDraft
 * @param executeAssertLogic
 */
export function runTestSuit(
  testSuitDesc: string,
  testCaseDesc: string,
  getArrBase: () => any[],
  operateDraft: (arrDraft: any[], arrBase: any[]) => void,
  executeAssertLogic: (arrNew: any[], arrBase: any[]) => void,
) {
  describe(testSuitDesc, () => {
    test(createDraftTip(testCaseDesc), () => {
      const arrBase = getArrBase();
      const arrDraft = createDraft(arrBase);
      operateDraft(arrDraft, arrBase);
      const arrNew = finishDraft(arrDraft);
      executeAssertLogic(arrNew, arrBase);
    });

    test(produceTip(testCaseDesc), () => {
      const arrBase = getArrBase();
      const arrNew = produce(arrBase, arrDraft => {
        operateDraft(arrDraft, arrBase);
      });
      executeAssertLogic(arrNew, arrBase);
    });
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

    // test(produceTip(testCaseDesc), () => {
    //   const mapBase = getMapBase();
    //   const mapNew = produce(mapBase, mapDraft => {
    //     operateDraft(mapDraft, mapBase);
    //   });
    //   executeAssertLogic(mapNew, mapBase);
    // });
  })
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

    // test(produceTip(testCaseDesc), () => {
    //   const mapBase = getMapBase();
    //   const mapNew = produce(mapBase, mapDraft => {
    //     operateDraft(mapDraft, mapBase);
    //   });
    //   executeAssertLogic(mapNew, mapBase);
    // });
  })
}
