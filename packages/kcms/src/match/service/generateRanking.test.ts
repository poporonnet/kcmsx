import { Result } from '@mikuroxina/mini-fn';
import { describe, expect, it } from 'vitest';
import { TeamID } from '../../team/models/team';
import { testRankingMainMatchData, testRankingPreMatchData } from '../../testData/match';
import { DummyMainMatchRepository } from '../adaptor/dummy/mainMatchRepository';
import { DummyPreMatchRepository } from '../adaptor/dummy/preMatchRepository';
import { GenerateRankingService, RankingDatum } from './generateRanking';

describe('GenerateRankingService', () => {
  const preMatchRepository = new DummyPreMatchRepository(testRankingPreMatchData);
  const mainMatchRepository = new DummyMainMatchRepository(testRankingMainMatchData);
  const service = new GenerateRankingService(preMatchRepository, mainMatchRepository);

  it('予選: 部門ごとのランキングが生成できる', async () => {
    const res = await service.generatePreMatchRanking('elementary');
    expect(Result.isErr(res)).toBe(false);
    expect(Result.unwrap(res)).toHaveLength(11);
  });

  it('本戦(安来用): 部門ごとのランキングが生成できる', async () => {
    const res = await service.generateMainMatchRanking('elementary');
    expect(Result.isErr(res)).toBe(false);
    expect(Result.unwrap(res)).toHaveLength(2);
  });

  it('予選: 同じ順位の場合、ゴールタイムでソートする', async () => {
    const expected = [
      { rank: 1, teamID: '1' as TeamID, points: 12, goalTimeSeconds: 60 },
      { rank: 2, teamID: '2' as TeamID, points: 10, goalTimeSeconds: 64 },
      { rank: 3, teamID: '3' as TeamID, points: 9, goalTimeSeconds: 70 },
      { rank: 4, teamID: '4' as TeamID, points: 7, goalTimeSeconds: 74 },
      { rank: 5, teamID: '5' as TeamID, points: 5, goalTimeSeconds: 80 },
      { rank: 6, teamID: '7' as TeamID, points: 4, goalTimeSeconds: 90 },
      { rank: 7, teamID: '6' as TeamID, points: 4, goalTimeSeconds: 100 },
      { rank: 8, teamID: '8' as TeamID, points: 1, goalTimeSeconds: 100 },
      { rank: 8, teamID: '9' as TeamID, points: 1, goalTimeSeconds: 100 },
      { rank: 10, teamID: '10' as TeamID, points: 0, goalTimeSeconds: Infinity },
      { rank: 10, teamID: '11' as TeamID, points: 0, goalTimeSeconds: Infinity },
    ];

    const res = await service.generatePreMatchRanking('elementary');
    expect(Result.isErr(res)).toBe(false);
    expect(Result.unwrap(res)).toStrictEqual(expected);
  });

  it('本戦(安来用): 同じ順位の場合、ゴールタイムでソートする', async () => {
    const expected: RankingDatum[] = [
      { rank: 1, teamID: '91' as TeamID, points: 17, goalTimeSeconds: 60 },
      { rank: 2, teamID: '92' as TeamID, points: 17, goalTimeSeconds: 80 },
    ];

    const res = await service.generateMainMatchRanking('elementary');
    expect(Result.isErr(res)).toBe(false);
    expect(Result.unwrap(res)).toStrictEqual(expected);
  });
});
