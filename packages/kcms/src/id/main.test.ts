import { Result } from '@mikuroxina/mini-fn';
import { describe, expect, it } from 'vitest';
import { SnowflakeIDGenerator } from './main.js';

describe('SnowflakeIDGenerator', () => {
  it('正しいIDを生成できる', () => {
    const generator = new SnowflakeIDGenerator(1, () =>
      BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
    );
    const expected = '264543141888004096';
    const actual = generator.generate<string>();

    expect(Result.unwrap(actual)).toEqual(expected);
  });

  it('同時に生成しても重複が無い', () => {
    const generator = new SnowflakeIDGenerator(1, () =>
      BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
    );
    let oldID = '';
    for (let i = 0; i < 4096; i++) {
      const newIDRes = generator.generate();
      expect(Result.isOk(newIDRes)).toBe(true);

      const newID = Result.unwrap(newIDRes);
      expect(newID).not.toBe(oldID);
      
      oldID = newID;
    }

    const res = generator.generate();
    expect(Result.isErr(res)).toBe(true);
  });
});
