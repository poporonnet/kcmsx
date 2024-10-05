import { Result } from '@mikuroxina/mini-fn';
import { describe, expect, it } from 'vitest';
import { SnowflakeIDGenerator } from '../../id/main';
import { TeamID } from '../../team/models/team';
import { FinishState } from '../model/runResult';
import { CreateRunResultService } from './createRunResult';
describe('CreateRunResult', () => {
  const generator = new SnowflakeIDGenerator(1, () =>
    BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
  );
  const service = new CreateRunResultService(generator);
  it('正しく試合結果を作成できる', async () => {
    const runResult = [
      {
        teamID: '100' as TeamID,
        points: 10,
        goalTimeSeconds: 100,
        finishState: 'GOAL' as FinishState,
      },
    ];
    const res = await service.handle(runResult);
    expect(Result.isOk(res)).toBe(true);
    const results = Result.unwrap(res);
    expect(results[0].getTeamId()).toBe('100');
    expect(results[0].getPoints()).toBe(10);
    expect(results[0].getGoalTimeSeconds()).toBe(100);
    expect(results[0].isGoal()).toBe(true);
    expect(results[0].isFinished()).toBe(false);
  });
  it('2つの試合結果を作成できる', async () => {
    const runResult = [
      {
        teamID: '100' as TeamID,
        points: 10,
        goalTimeSeconds: 100,
        finishState: 'GOAL' as FinishState,
      },
      {
        teamID: '101' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED' as FinishState,
      },
    ];
    const res = await service.handle(runResult);
    expect(Result.isOk(res)).toBe(true);
    const results = Result.unwrap(res);
    expect(results[0].getTeamId()).toBe('100');
    expect(results[0].getPoints()).toBe(10);
    expect(results[0].getGoalTimeSeconds()).toBe(100);
    expect(results[0].isGoal()).toBe(true);
    expect(results[0].isFinished()).toBe(false);

    expect(results[1].getTeamId()).toBe('101');
    expect(results[1].getPoints()).toBe(0);
    expect(results[1].getGoalTimeSeconds()).toBe(Infinity);
    expect(results[1].isGoal()).toBe(false);
    expect(results[1].isFinished()).toBe(true);
  });
});
