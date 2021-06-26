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
 * common getArrBase handler
 * @returns
 */
export function getArrBase() {
  return [1, 2, 3];
}

/**
 * common compare handler
 * new and base should be equal
 */
export function shouldBeEqual(arrNew, arrBase) {
  expect(arrNew === arrBase).toBeTruthy();
}
/**
 * common compare handler
 * new and base should be not equal
 */
export function shouldBeNotEqual(arrNew, arrBase) {
  expect(arrNew !== arrBase).toBeTruthy();
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
    })
  })
}
