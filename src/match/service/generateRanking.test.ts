import { describe, expect, it } from 'vitest';
import { DummyMatchRepository } from '../adaptor/dummyRepository.js';
import { GenerateRankingService } from './generateRanking.js';
import { TestRankingMatchData } from '../../testData/match.js';

describe('GenerateRankingService', () => {
  const repository = new DummyMatchRepository(TestRankingMatchData);
  const service = new GenerateRankingService(repository);

  it('正しくランキングを生成できる', async () => {
    const [actual] = await service.handle();
    /*
      順位順: 101, 102, 103, 107, 108, 109
      得点:   20   19,   18,   8    6,  6
      時間:  60,   64,   70,  80,  90,100
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
        points: 8,
        time: 80,
        id: '107',
      },
      {
        rank: 5,
        points: 6,
        time: 90,
        id: '108',
      },
      {
        rank: 6,
        points: 6,
        time: 100,
        id: '109',
      },
    ];

    actual.map((v, i) => {
      console.log(v.entry.id, v.rank, v.points, v.time);
      expect({
        rank: v.rank,
        points: v.points,
        time: v.time,
        id: v.entry.id,
      }).toStrictEqual(expected[i]);
    });
  });
});
