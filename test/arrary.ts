import { createDraft, finishDraft } from '../src/index';


describe('array', () => {

  test('do nothing', () => {
    const arrBase = [1, 2, 3];
    const arrDraft = createDraft(arrBase);
    const arrNew = finishDraft(arrDraft);

    expect(arrNew === arrBase).toBeTruthy();
  })
  
  test('push', () => {
    const arrBase = [1, 2, 3];
    const arrDraft = createDraft(arrBase);
    arrDraft.push(4);
    const arrNew = finishDraft(arrDraft);

    expect(arrBase.length === 3).toBeTruthy();
    expect(arrNew.length === 4).toBeTruthy();
    expect(arrNew !== arrBase).toBeTruthy();
  })

  test('pop', () => {
    const arrBase = [1, 2, 3];
    const arrDraft = createDraft(arrBase);
    const lastItem = arrDraft.pop();
    expect(lastItem === 3).toBeTruthy();
    const arrNew = finishDraft(arrDraft);

    expect(arrBase.length === 3).toBeTruthy();
    expect(arrNew.length === 2).toBeTruthy();
    expect(arrNew !== arrBase).toBeTruthy();
  })

  test('delete', () => {
    const arrBase = [1, 2, 3];
    const arrDraft = createDraft(arrBase);
    delete arrDraft['0'];
    const arrNew = finishDraft(arrDraft);

    expect(arrNew !== arrBase).toBeTruthy();
  })

  test('slice', () => {
    const arrBase = [1, 2, 3];
    const arrDraft = createDraft(arrBase);
    const arrDraftNew = arrDraft.slice();
    const arrNew = finishDraft(arrDraft);

    expect(arrDraftNew !== arrBase).toBeTruthy();
    expect(arrNew === arrBase).toBeTruthy();
  })

  test('slice then change draft', () => {
    const arrBase = [1, 2, 3];
    const arrDraft = createDraft(arrBase);
    const arrDraftNew = arrDraft.slice();
    arrDraft.push(4);
    const arrNew = finishDraft(arrDraft);

    expect(arrDraftNew !== arrBase).toBeTruthy();
    expect(arrNew !== arrBase).toBeTruthy();
  })

});