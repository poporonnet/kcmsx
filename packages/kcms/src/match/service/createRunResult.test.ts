import { Result } from '@mikuroxina/mini-fn';
import { describe, expect, it } from 'vitest';
import { SnowflakeIDGenerator } from '../../id/main';
import { TeamID } from '../../team/models/team';
import { testCreateRunResultMainData, testCreateRunResultPreData } from '../../testData/match';
import { DummyMainMatchRepository } from '../adaptor/dummy/mainMatchRepository';
import { DummyPreMatchRepository } from '../adaptor/dummy/preMatchRepository';
import { MainMatchID } from '../model/main';
import { PreMatchID } from '../model/pre';
import { CreateRunResultArgs } from '../model/runResult';
import { CreateRunResultService } from './createRunResult';
describe('CreateRunResult', () => {
  const id = '264543141888004096';
  const dummyPreMatchRepository = new DummyPreMatchRepository(testCreateRunResultPreData);
  const dummyMainMatchRepository = new DummyMainMatchRepository(testCreateRunResultMainData);

  it('正しく試合結果を作成できる(Pre)', async () => {
    const generator = new SnowflakeIDGenerator(1, () =>
      BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
    );
    const service = new CreateRunResultService(
      generator,
      dummyPreMatchRepository,
      dummyMainMatchRepository
    );
    const runResult: Omit<CreateRunResultArgs, 'id'>[] = [
      {
        teamID: '1' as TeamID,
        points: 10,
        goalTimeSeconds: 100,
        finishState: 'GOAL',
      },
    ];
    const res = await service.handle('pre', '1' as PreMatchID, runResult);
    expect(Result.isOk(res)).toBe(true);
    const results = Result.unwrap(res);
    expect(results[0].getId()).toBe(id);
    expect(results[0].getTeamId()).toBe('1');
    expect(results[0].getPoints()).toBe(10);
    expect(results[0].getGoalTimeSeconds()).toBe(100);
    expect(results[0].isGoal()).toBe(true);
    expect(results[0].isFinished()).toBe(false);
  });
  it('正しく試合結果を作成できる(Main)', async () => {
    const generator = new SnowflakeIDGenerator(1, () =>
      BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
    );
    const service = new CreateRunResultService(
      generator,
      dummyPreMatchRepository,
      dummyMainMatchRepository
    );
    const id = '264543141888004096';

    const runResult: Omit<CreateRunResultArgs, 'id'>[] = [
      {
        teamID: '91' as TeamID,
        points: 10,
        goalTimeSeconds: 100,
        finishState: 'GOAL',
      },
      {
        teamID: '92' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      },
    ];
    const res = await service.handle('main', '900' as MainMatchID, runResult);
    expect(Result.isOk(res)).toBe(true);
    const results = Result.unwrap(res);
    expect(results[0].getId()).toBe(id);
    expect(results[0].getTeamId()).toBe('91');
    expect(results[0].getPoints()).toBe(10);
    expect(results[0].getGoalTimeSeconds()).toBe(100);
    expect(results[0].isGoal()).toBe(true);
    expect(results[0].isFinished()).toBe(false);
  });
});
