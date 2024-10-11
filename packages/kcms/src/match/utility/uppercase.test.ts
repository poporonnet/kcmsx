import { describe, expect, it } from 'vitest';
import { FinishState } from '../model/runResult';
import { upcase } from './uppercase';

describe('upcase', () => {
  it('大文字に変換できる(finished)', () => {
    expect(upcase('finished')).toBe('FINISHED');
  });

  it('大文字に変換できる(goal)', () => {
    expect(upcase('goal')).toBe('GOAL');
  });

  it('型テスト', () => {
    const state: 'goal' | 'finished' = 'finished';
    const upcased: FinishState = upcase(state);
    expect(upcased).toBe('FINISHED');
  });
});
