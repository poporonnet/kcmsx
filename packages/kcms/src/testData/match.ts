import { MatchID, Match } from '../match/match.js';
import { TestEntryData, TestEntrySet } from './entry.js';
import { Entry, EntryID } from '../entry/entry.js';

// ToDo: もっとデータ数を増やす
export const TestMatchData = {
  ElementaryPrimary: Match.reconstruct({
    id: '1' as MatchID,
    teams: {
      left: TestEntryData.ElementaryMultiWalk,
      right: TestEntryData.ElementaryWheel,
    },
    courseIndex: 0,
    matchType: 'primary',
  }),
  ElementaryFinal: Match.reconstruct({
    id: '2' as MatchID,
    teams: {
      left: TestEntryData.ElementaryMultiWalk,
      right: TestEntryData.ElementaryWheel,
    },
    courseIndex: 0,
    matchType: 'final',
  }),
  OpenFinal: Match.reconstruct({
    id: '3' as MatchID,
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
/*        1    2     3   4   5    6   7    8
  順位順: 101, 102, 103, 104 107, 108, 109, 110
  得点:   20   19,   18, 10,   8    6,  6,   4
  時間:  60,   64,   70, 74, 80,  90,100, 180
*/
export const TestRankingMatchData = [
  // ToDo: L/Rを入れるとL/Rを入れ替えたデータも作れるようにしたい
  Match.reconstruct(
    matchArgsBuilder(
      '200' as MatchID,
      {
        left: TestEntrySet.ElementaryMultiWalk[101],
        right: TestEntrySet.ElementaryWheel[107],
      },
      'primary',
      {
        left: {
          teamID: '101' as EntryID,
          points: 10,
          time: 30,
        },
        right: {
          teamID: '107' as EntryID,
          points: 4,
          time: 40,
        },
      }
    )
  ),
  Match.reconstruct(
    matchArgsBuilder(
      '201' as MatchID,
      {
        left: TestEntrySet.ElementaryWheel[107],
        right: TestEntrySet.ElementaryMultiWalk[101],
      },
      'primary',
      {
        left: {
          teamID: '107' as EntryID,
          points: 4,
          time: 40,
        },
        right: {
          teamID: '101' as EntryID,
          points: 10,
          time: 30,
        },
      }
    )
  ),

  Match.reconstruct(
    matchArgsBuilder(
      '202' as MatchID,
      {
        left: TestEntrySet.ElementaryMultiWalk[102],
        right: TestEntrySet.ElementaryWheel[108],
      },
      'primary',
      {
        left: {
          teamID: '102' as EntryID,
          points: 9,
          time: 32,
        },
        right: {
          teamID: '108' as EntryID,
          points: 3,
          time: 45,
        },
      }
    )
  ),
  Match.reconstruct(
    matchArgsBuilder(
      '203' as MatchID,
      {
        left: TestEntrySet.ElementaryWheel[108],
        right: TestEntrySet.ElementaryMultiWalk[102],
      },
      'primary',
      {
        left: {
          teamID: '108' as EntryID,
          points: 3,
          time: 45,
        },
        right: {
          teamID: '102' as EntryID,
          points: 10,
          time: 32,
        },
      }
    )
  ),

  Match.reconstruct(
    matchArgsBuilder(
      '204' as MatchID,
      {
        left: TestEntrySet.ElementaryMultiWalk[103],
        right: TestEntrySet.ElementaryWheel[109],
      },
      'primary',
      {
        left: {
          teamID: '103' as EntryID,
          points: 9,
          time: 35,
        },
        right: {
          teamID: '109' as EntryID,
          points: 3,
          time: 50,
        },
      }
    )
  ),
  Match.reconstruct(
    matchArgsBuilder(
      '205' as MatchID,
      {
        left: TestEntrySet.ElementaryWheel[109],
        right: TestEntrySet.ElementaryMultiWalk[103],
      },
      'primary',
      {
        left: {
          teamID: '109' as EntryID,
          points: 3,
          time: 50,
        },
        right: {
          teamID: '103' as EntryID,
          points: 9,
          time: 35,
        },
      }
    )
  ),

  Match.reconstruct(
    matchArgsBuilder(
      '205' as MatchID,
      {
        left: TestEntrySet.ElementaryMultiWalk[104],
        right: TestEntrySet.ElementaryWheel[110],
      },
      'primary',
      {
        left: {
          teamID: '104' as EntryID,
          points: 5,
          time: 37,
        },
        right: {
          teamID: '110' as EntryID,
          points: 2,
          time: 90,
        },
      }
    )
  ),
  Match.reconstruct(
    matchArgsBuilder(
      '206' as MatchID,
      {
        left: TestEntrySet.ElementaryWheel[110],
        right: TestEntrySet.ElementaryMultiWalk[104],
      },
      'primary',
      {
        left: {
          teamID: '110' as EntryID,
          points: 2,
          time: 90,
        },
        right: {
          teamID: '104' as EntryID,
          points: 5,
          time: 37,
        },
      }
    )
  ),
];
