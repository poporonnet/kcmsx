import { config } from 'config';
import { MainMatch, MainMatchID } from '../match/model/main.js';
import { PreMatch, PreMatchID } from '../match/model/pre.js'; // ToDo: もっとデータ数を増やす
import { RunResult, RunResultID } from '../match/model/runResult.js';
import { TeamID } from '../team/models/team.js';

// 試合結果更新用のテストデータ
export const testCreateRunResultPreData = [
  PreMatch.new({
    id: '1' as PreMatchID,
    courseIndex: 0,
    matchIndex: 1,
    departmentType: config.departments[0].type,
    teamID1: '1' as TeamID,
    teamID2: '2' as TeamID,
    runResults: [],
  }),
  PreMatch.new({
    id: '2' as PreMatchID,
    courseIndex: 0,
    matchIndex: 2,
    departmentType: config.departments[0].type,
    teamID1: '2' as TeamID,
    teamID2: '1' as TeamID,
    runResults: [],
  }),
  PreMatch.new({
    id: '3' as PreMatchID,
    courseIndex: 0,
    matchIndex: 3,
    departmentType: config.departments[0].type,
    teamID1: '3' as TeamID,
    teamID2: '4' as TeamID,
    runResults: [],
  }),
];
export const testCreateRunResultMainData = [
  MainMatch.new({
    id: '900' as MainMatchID,
    courseIndex: 1,
    matchIndex: 1,
    departmentType: config.departmentTypes[0],
    teamID1: '91' as TeamID,
    teamID2: '92' as TeamID,
    winnerID: '91' as TeamID,
    runResults: [],
    parentMatchID: '999' as MainMatchID,
    childMatches: undefined,
  }),
];
// ランキング生成用の試合データ
// Openは予選がないので、予選の試合データはない
/*
   チームID:  1    2    3    4    5    6    7   8    9   10  11
   得点:    12,  10,   9,   7,   5,   4,   4,   1    1  n/a n/a
   時間:    60,  64,  70,  74,  80, 100,  90, 100, 100  n/a n/a

   10,11は試合が始まっていない
   7,8は左右入れ替えの片方のみ行われている
*/
export const testRankingPreMatchData = [
  PreMatch.new({
    id: '100' as PreMatchID,
    courseIndex: 0,
    matchIndex: 1,
    departmentType: config.departments[0].type,
    teamID1: '1' as TeamID,
    teamID2: '2' as TeamID,
    runResults: [
      RunResult.new({
        id: '10' as RunResultID,
        teamID: '1' as TeamID,
        points: 12,
        goalTimeSeconds: 60,
        finishState: 'GOAL',
      }),
      RunResult.new({
        id: '11' as RunResultID,
        teamID: '2' as TeamID,
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
    departmentType: config.departments[0].type,
    teamID1: '2' as TeamID,
    teamID2: '1' as TeamID,
    runResults: [
      RunResult.new({
        id: '12' as RunResultID,
        teamID: '2' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
      RunResult.new({
        id: '13' as RunResultID,
        teamID: '1' as TeamID,
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
    departmentType: config.departments[0].type,
    teamID1: '3' as TeamID,
    teamID2: '4' as TeamID,
    runResults: [
      RunResult.new({
        id: '14' as RunResultID,
        teamID: '3' as TeamID,
        points: 9,
        goalTimeSeconds: 70,
        finishState: 'GOAL',
      }),
      RunResult.new({
        id: '15' as RunResultID,
        teamID: '4' as TeamID,
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
    departmentType: config.departments[0].type,
    teamID1: '4' as TeamID,
    teamID2: '3' as TeamID,
    runResults: [
      RunResult.new({
        id: '16' as RunResultID,
        teamID: '3' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
      RunResult.new({
        id: '17' as RunResultID,
        teamID: '4' as TeamID,
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
    departmentType: config.departments[0].type,
    teamID1: '5' as TeamID,
    teamID2: '6' as TeamID,
    runResults: [
      RunResult.new({
        id: '18' as RunResultID,
        teamID: '5' as TeamID,
        points: 5,
        goalTimeSeconds: 80,
        finishState: 'GOAL',
      }),
      RunResult.new({
        id: '19' as RunResultID,
        teamID: '6' as TeamID,
        points: 4,
        goalTimeSeconds: 100,
        finishState: 'GOAL',
      }),
    ],
  }),
  PreMatch.new({
    id: '105' as PreMatchID,
    courseIndex: 0,
    matchIndex: 6,
    departmentType: config.departments[0].type,
    teamID1: '6' as TeamID,
    teamID2: '5' as TeamID,
    runResults: [
      RunResult.new({
        id: '20' as RunResultID,
        teamID: '5' as TeamID,
        points: 0,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
      RunResult.new({
        id: '21' as RunResultID,
        teamID: '6' as TeamID,
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
    departmentType: config.departments[0].type,
    teamID1: '7' as TeamID,
    teamID2: '8' as TeamID,
    runResults: [
      RunResult.new({
        id: '22' as RunResultID,
        teamID: '7' as TeamID,
        points: 4,
        goalTimeSeconds: 90,
        finishState: 'GOAL',
      }),
      RunResult.new({
        id: '23' as RunResultID,
        teamID: '8' as TeamID,
        points: 1,
        goalTimeSeconds: 100,
        finishState: 'GOAL',
      }),
    ],
  }),
  PreMatch.new({
    id: '107' as PreMatchID,
    courseIndex: 0,
    matchIndex: 8,
    departmentType: config.departments[0].type,
    teamID1: '8' as TeamID,
    teamID2: '7' as TeamID,
    runResults: [],
  }),

  PreMatch.new({
    id: '108' as PreMatchID,
    courseIndex: 0,
    matchIndex: 9,
    departmentType: config.departments[0].type,
    teamID1: '9' as TeamID,
    teamID2: undefined,
    runResults: [
      RunResult.new({
        id: '26' as RunResultID,
        teamID: '9' as TeamID,
        points: 1,
        goalTimeSeconds: 100,
        finishState: 'GOAL',
      }),
    ],
  }),
  PreMatch.new({
    id: '107' as PreMatchID,
    courseIndex: 0,
    matchIndex: 10,
    departmentType: config.departments[0].type,
    teamID1: '9' as TeamID,
    teamID2: undefined,
    runResults: [
      RunResult.new({
        id: '27' as RunResultID,
        teamID: '9' as TeamID,
        points: 0,
        goalTimeSeconds: 100,
        finishState: 'GOAL',
      }),
    ],
  }),

  PreMatch.new({
    id: '108' as PreMatchID,
    courseIndex: 0,
    matchIndex: 11,
    departmentType: config.departments[0].type,
    teamID1: '10' as TeamID,
    teamID2: '11' as TeamID,
    runResults: [],
  }),
  PreMatch.new({
    id: '109' as PreMatchID,
    courseIndex: 0,
    matchIndex: 12,
    departmentType: config.departments[0].type,
    teamID1: '11' as TeamID,
    teamID2: '10' as TeamID,
    runResults: [],
  }),
];

/**
 * **安来用**本戦ランキング生成用の試合データ
 * 本戦は本来トーナメントなので、この限りではない
 */
export const testRankingMainMatchData = [
  // ToDo: L/Rを入れるとL/Rを入れ替えたデータも作れるようにしたい
  MainMatch.new({
    id: '900' as MainMatchID,
    courseIndex: 1,
    matchIndex: 1,
    departmentType: config.departmentTypes[0],
    teamID1: '91' as TeamID,
    teamID2: '92' as TeamID,
    winnerID: '91' as TeamID,
    runResults: [
      RunResult.new({
        id: '80' as RunResultID,
        teamID: '91' as TeamID,
        points: 12,
        goalTimeSeconds: 60,
        finishState: 'GOAL',
      }),
      RunResult.new({
        id: '81' as RunResultID,
        teamID: '92' as TeamID,
        points: 10,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
      RunResult.new({
        id: '82' as RunResultID,
        teamID: '91' as TeamID,
        points: 5,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
      RunResult.new({
        id: '83' as RunResultID,
        teamID: '92' as TeamID,
        points: 7,
        goalTimeSeconds: 80,
        finishState: 'GOAL',
      }),
    ],
    parentMatchID: '999' as MainMatchID,
    childMatches: undefined,
  }),
];
