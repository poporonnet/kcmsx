import { describe, expect, it } from 'vitest';
import { DummyMainMatchRepository } from '../adaptor/dummy/mainMatchRepository.js';
import { GenerateRankingService } from './generateRanking.js';
import { TestRankingPreMatchData } from '../../testData/match.js';

describe('GenerateRankingService', () => {
  const repository = new DummyMainMatchRepository(TestRankingPreMatchData);
  const service = new GenerateRankingService(repository);

  it('正しくランキングを生成できる', async () => {
    const [actual] = await service.handle();
    /*
      チームID:  1    2    3    4    5    6    7    8   9
      得点:    12,  10,   9,   7,   5,   4,   4,   2   1
      時間:    60,  64,  70,  74,  80,  90, 100, 180 200
    */
    const expected = [
      {
        rank: 1,
        points: 20,
        time: 60,
        id: '101',
      },
      {
        rank: 2,
        points: 19,
        time: 64,
        id: '102',
      },
      {
        rank: 3,
        points: 18,
        time: 70,
        id: '103',
      },
      {
        rank: 4,
        points: 10,
        time: 74,
        id: '104',
      },
      {
        rank: 5,
        points: 8,
        time: 80,
        id: '107',
      },
      {
        rank: 6,
        points: 6,
        time: 90,
        id: '108',
      },
      {
        rank: 7,
        points: 6,
        time: 100,
        id: '109',
      },
      {
        rank: 8,
        points: 4,
        time: 180,
        id: '110',
      },
    ];

    actual.map((v, i) => {
      console.log(v.entry.getId, v.rank, v.points, v.time);
      expect({
        rank: v.rank,
        points: v.points,
        time: v.time,
        id: v.entry.getId(),
      }).toStrictEqual(expected[i]);
    });
  });
});
