import { describe, it, expect } from 'vitest';
import { DummyMatchRepository } from '../adaptor/dummyRepository.js';
import { TestRankingMatchData } from '../../testData/match.js';
import { GenerateFinalMatchService } from './generateFinal.js';
import { DummyRepository } from '../../entry/adaptor/dummyRepository.js';
import { TestEntrySet } from '../../testData/entry.js';
import { GenerateRankingService } from './generateRanking.js';
import { SnowflakeIDGenerator } from '../../id/main.js';
import { Result, Option } from '@mikuroxina/mini-fn';
import { MatchResultFinalPair } from '../match.js';
import { EntryID } from '../../entry/entry.js';

describe('GenerateFinal1st', () => {
  const repository = new DummyMatchRepository(TestRankingMatchData);
  const entryRepository = new DummyRepository([
    TestEntrySet.ElementaryMultiWalk[101],
    TestEntrySet.ElementaryMultiWalk[102],
    TestEntrySet.ElementaryMultiWalk[103],

    TestEntrySet.ElementaryWheel[107],
    TestEntrySet.ElementaryWheel[108],
    TestEntrySet.ElementaryWheel[109],
  ]);
  const rankingService = new GenerateRankingService(repository);
  const service = new GenerateFinalMatchService(
    entryRepository,
    repository,
    rankingService,
    new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()))
  );
  // 1 vs 8, 4 vs 5, 2 vs 7, 3 vs 6 (数字は順位)
  // cf. src/testData/match.ts
  const expected = [
    {
      left: '101',
      right: '110',
    },
    {
      left: '104',
      right: '107',
    },
    {
      left: '102',
      right: '109',
    },
    {
      left: '103',
      right: '108',
    },
  ];

  it('小学生部門の初期対戦を生成できる', async () => {
    const actual = await service.handle('elementary');
    expect(Result.isOk(actual)).toBe(true);

    Result.unwrap(actual).map((v, i) => {
      expect(expected[i]).toStrictEqual({
        left: v.teams.left!.id,
        right: v.teams.right!.id,
      });
    });
  });

  // ToDo: オープン部門のテスト
});

describe('GenerateFinalNth', () => {
  const repository = new DummyMatchRepository(TestRankingMatchData);
  const entryRepository = new DummyRepository([
    TestEntrySet.ElementaryMultiWalk[101],
    TestEntrySet.ElementaryMultiWalk[102],
    TestEntrySet.ElementaryMultiWalk[103],

    TestEntrySet.ElementaryWheel[107],
    TestEntrySet.ElementaryWheel[108],
    TestEntrySet.ElementaryWheel[109],
  ]);
  const rankingService = new GenerateRankingService(repository);
  const service = new GenerateFinalMatchService(
    entryRepository,
    repository,
    rankingService,
    new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()))
  );
  const expected2nd = [
    {
      left: {
        id: '101',
      },
      right: {
        id: '104',
      },
    },
    {
      left: {
        id: '102',
      },
      right: {
        id: '103',
      },
    },
  ];
  it('n段目まで終わっているかの判断が正しくできる', async () => {
    /*
      境界値分析

      0回戦まで終了
      下限: 0試合
      上限: 3試合
      ----
      1回戦まで終了
      下限: 4試合
      上限: 6試合
      ----
      2回戦まで終了
      下限: 7試合
      上限: 7試合
      ----
      invalid
      下限: 8試合
    */

    const Entry = 8;

    expect(Result.unwrap(service.isGenerative(Entry, 0))).toBe(0);
    expect(Result.unwrap(service.isGenerative(Entry, 3))).toBe(0);
    // 1回戦まで終了
    expect(Result.unwrap(service.isGenerative(Entry, 4))).toBe(1);
    expect(Result.unwrap(service.isGenerative(Entry, 5))).toBe(1);
    // 2回戦まで終了
    expect(Result.unwrap(service.isGenerative(Entry, 6))).toBe(2);
    // すべて終了
    expect(Result.unwrap(service.isGenerative(Entry, 7))).toBe(-1);
    // エラー
    expect(service.isGenerative(Entry, 8)[1]).toStrictEqual(
      new Error('8 is invalid number of completed matches.')
    );
  });

  it('本選の2回戦目の試合を生成できる', async () => {
    const repository = new DummyMatchRepository(TestRankingMatchData);
    const entryRepository = new DummyRepository([
      TestEntrySet.ElementaryMultiWalk[101],
      TestEntrySet.ElementaryMultiWalk[102],
      TestEntrySet.ElementaryMultiWalk[103],

      TestEntrySet.ElementaryWheel[107],
      TestEntrySet.ElementaryWheel[108],
      TestEntrySet.ElementaryWheel[109],
    ]);
    const rankingService = new GenerateRankingService(repository);
    const service = new GenerateFinalMatchService(
      entryRepository,
      repository,
      rankingService,
      new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()))
    );
    // ------ ここまで初期化 -----
    // 1回目の結果を入れるために結果を取ってくる
    const res = Option.unwrap(await repository.findByType('final'));
    // 結果を入れ替える
    res.map(async (v) => {
      v.results = TestData[`${v.teams.left!.id}-${v.teams.right!.id}`];
      await repository.update(v);
    });

    const actual = await service.generateTournamentNth(1, 'Elementary');
    Result.unwrap(actual).map((v, i) => {
      expect({
        left: {
          id: v.teams.left!.id,
        },
        right: {
          id: v.teams.right!.id,
        },
      }).toStrictEqual(expected2nd[i]);
    });
  });
});

// 1回戦目の結果 (1 vs 4, 2 vs 3になるデータ)
const TestData: Record<string, MatchResultFinalPair> = {
  '101-110': {
    results: [
      {
        left: {
          teamID: '101' as EntryID,
          points: 10,
          time: 10,
        },
        right: {
          teamID: '110' as EntryID,
          points: 0,
          time: 180,
        },
      },
      {
        left: {
          teamID: '110' as EntryID,
          points: 0,
          time: 180,
        },
        right: {
          teamID: '101' as EntryID,
          points: 10,
          time: 10,
        },
      },
    ],
    winnerID: '101' as EntryID,
  },
  '104-107': {
    results: [
      {
        left: {
          teamID: '104' as EntryID,
          points: 10,
          time: 10,
        },
        right: {
          teamID: '107' as EntryID,
          points: 0,
          time: 180,
        },
      },
      {
        left: {
          teamID: '107' as EntryID,
          points: 0,
          time: 180,
        },
        right: {
          teamID: '104' as EntryID,
          points: 10,
          time: 10,
        },
      },
    ],
    winnerID: '104' as EntryID,
  },
  '102-109': {
    results: [
      {
        left: {
          teamID: '102' as EntryID,
          points: 10,
          time: 10,
        },
        right: {
          teamID: '109' as EntryID,
          points: 0,
          time: 180,
        },
      },
      {
        left: {
          teamID: '109' as EntryID,
          points: 0,
          time: 180,
        },
        right: {
          teamID: '102' as EntryID,
          points: 10,
          time: 10,
        },
      },
    ],
    winnerID: '102' as EntryID,
  },
  '103-108': {
    results: [
      {
        left: {
          teamID: '103' as EntryID,
          points: 10,
          time: 10,
        },
        right: {
          teamID: '108' as EntryID,
          points: 0,
          time: 180,
        },
      },
      {
        left: {
          teamID: '108' as EntryID,
          points: 0,
          time: 180,
        },
        right: {
          teamID: '103' as EntryID,
          points: 10,
          time: 10,
        },
      },
    ],
    winnerID: '103' as EntryID,
  },
};
