import { TeamID } from '../entry/models/team.js';
import { RunResult, RunResultID } from '../match/model/runResult.js';
import { PreMatch, PreMatchID } from '../match/model/pre.js'; // ToDo: もっとデータ数を増やす

// ランキング生成用の試合データ
// Openは予選がないので、予選の試合データはない
/*
   チームID:  1    2    3    4    5    6    7    8   9
   得点:    12,  10,   9,   7,   5,   4,   4,   2   1
   時間:    60,  64,  70,  74,  80,  90, 100, 180 200
*/
export const TestRankingPreMatchData = [
  PreMatch.new({
    id: '100' as PreMatchID,
    courseIndex: 0,
    matchIndex: 1,
    teamId1: '1' as TeamID,
    teamId2: '2' as TeamID,
    runResults: [
      RunResult.new({
        id: '10' as RunResultID,
        teamId: '1' as TeamID,
        points: 12,
        goalTimeSeconds: 60,
        finishState: 'GOAL',
      }),
      RunResult.new({
        id: '11' as RunResultID,
        teamId: '2' as TeamID,
        points: 10,
        goalTimeSeconds: 64,
        finishState: 'GOAL',
      }),
    ],
  }),
  PreMatch.new({
    id: '101' as PreMatchID,
    courseIndex: 0,
    matchIndex: 2,
    teamId1: '2' as TeamID,
    teamId2: '1' as TeamID,
    runResults: [
      RunResult.new({
        id: '12' as RunResultID,
        teamId: '2' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
      RunResult.new({
        id: '13' as RunResultID,
        teamId: '1' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
    ],
  }),

  PreMatch.new({
    id: '102' as PreMatchID,
    courseIndex: 0,
    matchIndex: 3,
    teamId1: '3' as TeamID,
    teamId2: '4' as TeamID,
    runResults: [
      RunResult.new({
        id: '14' as RunResultID,
        teamId: '3' as TeamID,
        points: 9,
        goalTimeSeconds: 70,
        finishState: 'GOAL',
      }),
      RunResult.new({
        id: '15' as RunResultID,
        teamId: '4' as TeamID,
        points: 7,
        goalTimeSeconds: 74,
        finishState: 'GOAL',
      }),
    ],
  }),
  PreMatch.new({
    id: '103' as PreMatchID,
    courseIndex: 0,
    matchIndex: 4,
    teamId1: '4' as TeamID,
    teamId2: '3' as TeamID,
    runResults: [
      RunResult.new({
        id: '16' as RunResultID,
        teamId: '3' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
      RunResult.new({
        id: '17' as RunResultID,
        teamId: '4' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
    ],
  }),

  PreMatch.new({
    id: '104' as PreMatchID,
    courseIndex: 0,
    matchIndex: 5,
    teamId1: '5' as TeamID,
    teamId2: '6' as TeamID,
    runResults: [
      RunResult.new({
        id: '18' as RunResultID,
        teamId: '5' as TeamID,
        points: 5,
        goalTimeSeconds: 80,
        finishState: 'GOAL',
      }),
      RunResult.new({
        id: '19' as RunResultID,
        teamId: '6' as TeamID,
        points: 4,
        goalTimeSeconds: 90,
        finishState: 'GOAL',
      }),
    ],
  }),
  PreMatch.new({
    id: '105' as PreMatchID,
    courseIndex: 0,
    matchIndex: 6,
    teamId1: '6' as TeamID,
    teamId2: '5' as TeamID,
    runResults: [
      RunResult.new({
        id: '20' as RunResultID,
        teamId: '5' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
      RunResult.new({
        id: '21' as RunResultID,
        teamId: '6' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
    ],
  }),

  PreMatch.new({
    id: '106' as PreMatchID,
    courseIndex: 0,
    matchIndex: 7,
    teamId1: '7' as TeamID,
    teamId2: '8' as TeamID,
    runResults: [
      RunResult.new({
        id: '22' as RunResultID,
        teamId: '7' as TeamID,
        points: 4,
        goalTimeSeconds: 100,
        finishState: 'GOAL',
      }),
      RunResult.new({
        id: '23' as RunResultID,
        teamId: '8' as TeamID,
        points: 2,
        goalTimeSeconds: 180,
        finishState: 'GOAL',
      }),
    ],
  }),
  PreMatch.new({
    id: '107' as PreMatchID,
    courseIndex: 0,
    matchIndex: 8,
    teamId1: '8' as TeamID,
    teamId2: '7' as TeamID,
    runResults: [
      RunResult.new({
        id: '24' as RunResultID,
        teamId: '7' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
      RunResult.new({
        id: '25' as RunResultID,
        teamId: '8' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
    ],
  }),

  PreMatch.new({
    id: '108' as PreMatchID,
    courseIndex: 0,
    matchIndex: 9,
    teamId1: '9' as TeamID,
    teamId2: undefined,
    runResults: [
      RunResult.new({
        id: '26' as RunResultID,
        teamId: '9' as TeamID,
        points: 1,
        goalTimeSeconds: 200,
        finishState: 'GOAL',
      }),
    ],
  }),
  PreMatch.new({
    id: '107' as PreMatchID,
    courseIndex: 0,
    matchIndex: 10,
    teamId1: '9' as TeamID,
    teamId2: undefined,
    runResults: [
      RunResult.new({
        id: '27' as RunResultID,
        teamId: '9' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
    ],
  }),
];

export const TestRankingMainMatchData = [
  // ToDo: L/Rを入れるとL/Rを入れ替えたデータも作れるようにしたい
];
