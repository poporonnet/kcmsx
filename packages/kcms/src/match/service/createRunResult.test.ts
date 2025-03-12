import { Option, Result } from '@mikuroxina/mini-fn';
import { config } from 'config';
import { describe, expect, it } from 'vitest';
import { SnowflakeIDGenerator } from '../../id/main';
import { TeamID } from '../../team/models/team';
import { testCreateRunResultMainData, testCreateRunResultPreData } from '../../testData/match';
import { DummyMainMatchRepository } from '../adaptor/dummy/mainMatchRepository';
import { DummyPreMatchRepository } from '../adaptor/dummy/preMatchRepository';
import { MainMatch, MainMatchID } from '../model/main';
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
    expect(results[0].getID()).toBe(id);
    expect(results[0].getTeamID()).toBe('1');
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
    expect(results[0].getID()).toBe(id);
    expect(results[0].getTeamID()).toBe('91');
    expect(results[0].getPoints()).toBe(10);
    expect(results[0].getGoalTimeSeconds()).toBe(100);
    expect(results[0].isGoal()).toBe(true);
    expect(results[0].isFinished()).toBe(false);
  });

  const testMainMatchData = () => [
    MainMatch.new({
      id: '900' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      departmentType: config.departmentTypes[0],
      teamID1: '91' as TeamID,
      teamID2: '92' as TeamID,
      winnerID: undefined,
      runResults: [],
      parentMatchID: '999' as MainMatchID,
      childMatches: undefined,
    }),
  ];

  // 91: 17pts,60s / 92: 17pts,80s -> 91が勝者
  const testRunResultData = (): Omit<CreateRunResultArgs, 'id'>[] => [
    {
      teamID: '91' as TeamID,
      points: 12,
      goalTimeSeconds: 60,
      finishState: 'GOAL',
    },
    {
      teamID: '92' as TeamID,
      points: 10,
      goalTimeSeconds: Infinity,
      finishState: 'FINISHED',
    },
    {
      teamID: '91' as TeamID,
      points: 5,
      goalTimeSeconds: Infinity,
      finishState: 'FINISHED',
    },
    {
      teamID: '92' as TeamID,
      points: 7,
      goalTimeSeconds: 80,
      finishState: 'GOAL',
    },
  ];

  it('Main: 得点が高い方を勝者にする', async () => {
    const dummyMainMatchRepository = new DummyMainMatchRepository(testMainMatchData());
    const generator = new SnowflakeIDGenerator(1, () =>
      BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
    );
    const service = new CreateRunResultService(
      generator,
      dummyPreMatchRepository,
      dummyMainMatchRepository
    );
    const runResults = testRunResultData();
    // 91: 13+5pts,60s / 92: 10+7pts,80s -> 91が勝者
    runResults[0].points = 13;

    await service.handle('main', '900' as MainMatchID, runResults);
    const matchRes = await dummyMainMatchRepository.findByID('900' as MainMatchID);
    const match = Option.unwrap(matchRes);
    expect(match.getWinnerID()).toBe('91');
  });

  it('Main: 同点ならベストタイムが早い方を勝者にする', async () => {
    const dummyMainMatchRepository = new DummyMainMatchRepository(testMainMatchData());
    const generator = new SnowflakeIDGenerator(1, () =>
      BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
    );
    const service = new CreateRunResultService(
      generator,
      dummyPreMatchRepository,
      dummyMainMatchRepository
    );

    // 91: 17pts,60s / 92: 17pts,80s -> 91が勝者
    await service.handle('main', '900' as MainMatchID, testRunResultData());
    const matchRes = await dummyMainMatchRepository.findByID('900' as MainMatchID);
    const match = Option.unwrap(matchRes);
    expect(match.getWinnerID()).toBe('91');
  });

  it('Main: 同点でベストタイムも同じなら、何もしない', async () => {
    const dummyMainMatchRepository = new DummyMainMatchRepository(testMainMatchData());
    const generator = new SnowflakeIDGenerator(1, () =>
      BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
    );
    const service = new CreateRunResultService(
      generator,
      dummyPreMatchRepository,
      dummyMainMatchRepository
    );
    const runResults = testRunResultData();
    // 91: 17pts,60s / 92: 17pts,60s -> 何もしない
    runResults[3].goalTimeSeconds = 60;

    await service.handle('main', '900' as MainMatchID, runResults);
    const matchRes = await dummyMainMatchRepository.findByID('900' as MainMatchID);
    const match = Option.unwrap(matchRes);
    expect(match.getWinnerID()).toBe(undefined);
  });

  it('Main: まだ試合が終わってないなら何もしない', async () => {
    const dummyMainMatchRepository = new DummyMainMatchRepository(testMainMatchData());
    const generator = new SnowflakeIDGenerator(1, () =>
      BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
    );
    const service = new CreateRunResultService(
      generator,
      dummyPreMatchRepository,
      dummyMainMatchRepository
    );
    const runResults = testRunResultData();
    await service.handle('main', '900' as MainMatchID, [runResults[0], runResults[1]]);
    const matchRes = await dummyMainMatchRepository.findByID('900' as MainMatchID);
    const match = Option.unwrap(matchRes);
    expect(match.getWinnerID()).toBe(undefined);
  });
});
