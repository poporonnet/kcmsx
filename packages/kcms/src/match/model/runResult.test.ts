import { describe, expect, it } from 'vitest';
import { RunResult, RunResultID } from './runResult.js';
import { EntryID } from '../../entry/entry.js';

describe('RunResult', () => {
  it('正しくインスタンスを生成できる(ゴール時)', () => {
    const result = RunResult.new({
      id: '999' as RunResultID,
      teamID: '100' as EntryID,
      points: 10,
      goalTimeSeconds: 100,
      finishState: 'FINISHED',
    });

    expect(result.getId()).toBe('999');
    expect(result.getTeamID()).toBe('100');
    expect(result.getPoints()).toBe(10);
    expect(result.getGoalTimeSeconds()).toBe(100);
    expect(result.getIsFinished()).toBe(true);
    expect(result.getIsRetired()).toBe(false);
  });

  it('正しくインスタンスを生成できる(フィニッシュ時)', () => {
    const result = RunResult.new({
      id: '999' as RunResultID,
      teamID: '100' as EntryID,
      points: 10,
      goalTimeSeconds: 100,
      finishState: 'RETIRED',
    });

    expect(result.getId()).toBe('999');
    expect(result.getTeamID()).toBe('100');
    expect(result.getPoints()).toBe(10);
    expect(result.getGoalTimeSeconds()).not.toBe(10);
    expect(result.getGoalTimeSeconds()).toBe(Infinity);
    expect(result.getIsFinished()).toBe(false);
    expect(result.getIsRetired()).toBe(true);
  });
});
