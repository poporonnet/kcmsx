import { describe, expect, it } from 'vitest';
import { eachSlice } from './eachSlice';

describe('eachSlice', () => {
  it('配列を指定した長さで分割できる(要素数が分割数の倍数の場合)', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(eachSlice(array, 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ]);
  });

  it('配列を指定した長さで分割できる(要素数が分割数の倍数でない場合)', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(eachSlice(array, 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8],
    ]);
  });
});
