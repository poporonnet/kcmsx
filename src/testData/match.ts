import { Match } from '../match/match.js';
import { TestEntryData, TestEntrySet } from './entry.js';
import { Entry } from '../entry/entry.js';

// ToDo: もっとデータ数を増やす
export const TestMatchData = {
  ElementaryPrimary: Match.reconstruct({
    id: '1',
    teams: {
      left: TestEntryData.ElementaryMultiWalk,
      right: TestEntryData.ElementaryWheel,
    },
    courseIndex: 0,
    matchType: 'primary',
  }),
  ElementaryFinal: Match.reconstruct({
    id: '2',
    teams: {
      left: TestEntryData.ElementaryMultiWalk,
      right: TestEntryData.ElementaryWheel,
    },
    courseIndex: 0,
    matchType: 'final',
  }),
  OpenFinal: Match.reconstruct({
    id: '3',
    teams: {
      left: TestEntryData.OpenMultiWalk,
      right: TestEntryData.OpenMultiWalk2,
    },
    courseIndex: 0,
    matchType: 'final',
  }),
};

type result = {
  teamID: string;
  points: number;
  time: number;
};

type resultBase<L, R> = {
  left: L;
  right: R;
};

type matchArgBase<
  ID extends string,
  Team extends { left: Entry | undefined; right: Entry | undefined },
  MatchT extends 'primary' | 'final',
  R extends resultBase<result, result> | undefined,
> = {
  id: ID;
  teams: Team;
  courseIndex: number;
  matchType: MatchT;
  results?: R;
};

const matchArgsBuilder = <
  ID extends string,
  Team extends { left: Entry | undefined; right: Entry | undefined },
  MatchT extends 'primary' | 'final',
  R extends resultBase<result, result>,
>(
  id: ID,
  team: Team,
  matchType: MatchT,
  result?: R
): matchArgBase<ID, Team, MatchT, R> => {
  return {
    id: id,
    teams: team,
    courseIndex: 0,
    matchType: matchType,
    results: result,
  };
};

// ランキング生成用の試合データ
// Openは予選がないので、予選の試合データはない
/*

順位順: 101, 102, 103, 107, 108, 109
得点:   20   19,   18,   8    6,  6
時間:  60,   64,   70,  80,  90,100

*/
export const TestRankingMatchData = [
  // ToDo: L/Rを入れるとL/Rを入れ替えたデータも作れるようにしたい
  Match.reconstruct(
    matchArgsBuilder(
      '200',
      {
        left: TestEntrySet.ElementaryMultiWalk[101],
        right: TestEntrySet.ElementaryWheel[107],
      },
      'primary',
      {
        left: {
          teamID: '101',
          points: 10,
          time: 30,
        },
        right: {
          teamID: '107',
          points: 4,
          time: 40,
        },
      }
    )
  ),
  Match.reconstruct(
    matchArgsBuilder(
      '201',
      {
        left: TestEntrySet.ElementaryWheel[107],
        right: TestEntrySet.ElementaryMultiWalk[101],
      },
      'primary',
      {
        left: {
          teamID: '107',
          points: 4,
          time: 40,
        },
        right: {
          teamID: '101',
          points: 10,
          time: 30,
        },
      }
    )
  ),

  Match.reconstruct(
    matchArgsBuilder(
      '202',
      {
        left: TestEntrySet.ElementaryMultiWalk[102],
        right: TestEntrySet.ElementaryWheel[108],
      },
      'primary',
      {
        left: {
          teamID: '102',
          points: 9,
          time: 32,
        },
        right: {
          teamID: '108',
          points: 3,
          time: 45,
        },
      }
    )
  ),
  Match.reconstruct(
    matchArgsBuilder(
      '203',
      {
        left: TestEntrySet.ElementaryWheel[108],
        right: TestEntrySet.ElementaryMultiWalk[102],
      },
      'primary',
      {
        left: {
          teamID: '108',
          points: 3,
          time: 45,
        },
        right: {
          teamID: '102',
          points: 10,
          time: 32,
        },
      }
    )
  ),

  Match.reconstruct(
    matchArgsBuilder(
      '204',
      {
        left: TestEntrySet.ElementaryMultiWalk[103],
        right: TestEntrySet.ElementaryWheel[109],
      },
      'primary',
      {
        left: {
          teamID: '103',
          points: 9,
          time: 35,
        },
        right: {
          teamID: '109',
          points: 3,
          time: 50,
        },
      }
    )
  ),
  Match.reconstruct(
    matchArgsBuilder(
      '205',
      {
        left: TestEntrySet.ElementaryWheel[109],
        right: TestEntrySet.ElementaryMultiWalk[103],
      },
      'primary',
      {
        left: {
          teamID: '109',
          points: 3,
          time: 50,
        },
        right: {
          teamID: '103',
          points: 9,
          time: 35,
        },
      }
    )
  ),
];
