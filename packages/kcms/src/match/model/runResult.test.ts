import { describe, expect, it } from 'vitest';
import { TeamID } from '../../team/models/team.js';
import { RunResult, RunResultID } from './runResult.js';

describe('RunResult', () => {
  it('正しくインスタンスを生成できる(ゴール時)', () => {
    const result = RunResult.new({
      id: '999' as RunResultID,
      teamID: '100' as TeamID,
      points: 10,
      goalTimeSeconds: 100,
      finishState: 'GOAL',
    });

    expect(result.getID()).toBe('999');
    expect(result.getTeamID()).toBe('100');
    expect(result.getPoints()).toBe(10);
    expect(result.getGoalTimeSeconds()).toBe(100);
    expect(result.isGoal()).toBe(true);
    expect(result.isFinished()).toBe(false);
  });

  it('正しくインスタンスを生成できる(フィニッシュ時)', () => {
    const result = RunResult.new({
      id: '999' as RunResultID,
      teamID: '100' as TeamID,
      points: 10,
      goalTimeSeconds: 100,
      finishState: 'FINISHED',
    });

    expect(result.getID()).toBe('999');
    expect(result.getTeamID()).toBe('100');
    expect(result.getPoints()).toBe(10);
    // フィニッシュ(リタイア)時はゴールタイムを記録しないのでInfinityにする
    expect(result.getGoalTimeSeconds()).not.toBe(10);
    expect(result.getGoalTimeSeconds()).toBe(Infinity);
    expect(result.isGoal()).toBe(false);
    expect(result.isFinished()).toBe(true);
  });
});
