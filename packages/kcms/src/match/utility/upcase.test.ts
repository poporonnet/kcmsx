import { describe, expect, it } from 'vitest';
import { upcase } from './upcase';

describe('upcase', () => {
  it('大文字に変換できる(finished)', () => {
    expect(upcase('finished')).toBe('FINISHED');
  });

  it('大文字に変換できる(goal)', () => {
    expect(upcase('goal')).toBe('GOAL');
  });
});
