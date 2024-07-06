import { describe, expect, it } from 'vitest';
import { RunResult, RunResultID } from './runResult.js';
import { EntryID } from '../../entry/entry.js';

describe('RunResult', () => {
  it('正しくインスタンスを生成できる', () => {
    const result = RunResult.new({
      id: '999' as RunResultID,
      teamID: '100' as EntryID,
      points: 10,
      goalTime: 100,
      isFinished: true,
    });

    expect(result.getId()).toBe('999');
    expect(result.getTeamID()).toBe('100');
    expect(result.getPoints()).toBe(10);
    expect(result.getGoalTime()).toBe(100);
    expect(result.getIsFinished()).toBe(true);
  });
});
