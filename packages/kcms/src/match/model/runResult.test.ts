import { describe, expect, it } from 'vitest';
import { RunResult, RunResultID } from './runResult.js';
import { EntryID } from '../../entry/entry.js';

describe('RunResult', () => {
  it('正しくインスタンスを生成できる(ゴール時)', () => {
    const result = RunResult.new({
      id: '999' as RunResultID,
      teamId: '100' as EntryID,
      points: 10,
      goalTimeSeconds: 100,
      finishState: 'GOAL',
    });

    expect(result.getId()).toBe('999');
    expect(result.getTeamId()).toBe('100');
    expect(result.getPoints()).toBe(10);
    expect(result.getGoalTimeSeconds()).toBe(100);
    expect(result.isGoal()).toBe(true);
    expect(result.isFinished()).toBe(false);
  });

  it('正しくインスタンスを生成できる(フィニッシュ時)', () => {
    const result = RunResult.new({
      id: '999' as RunResultID,
      teamId: '100' as EntryID,
      points: 10,
      goalTimeSeconds: 100,
      finishState: 'FINISHED',
    });

    expect(result.getId()).toBe('999');
    expect(result.getTeamId()).toBe('100');
    expect(result.getPoints()).toBe(10);
    // フィニッシュ(リタイア)時はゴールタイムを記録しないのでInfinityにする
    expect(result.getGoalTimeSeconds()).not.toBe(10);
    expect(result.getGoalTimeSeconds()).toBe(Infinity);
    expect(result.isGoal()).toBe(false);
    expect(result.isFinished()).toBe(true);
  });
});
